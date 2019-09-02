import assert from 'assert';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Node as PMNode, Schema, Node } from 'prosemirror-model';
import { insertPoint } from 'prosemirror-transform';
import { Decoration, DecorationSet, EditorView } from 'prosemirror-view';
import {
  EditorState,
  NodeSelection,
  Plugin,
  PluginKey,
} from 'prosemirror-state';
import { findDomRefAtPos } from 'prosemirror-utils';
import { UploadParams, PopupConfig } from '@atlaskit/media-picker';
import { MediaClientConfig } from '@atlaskit/media-core';
import { MediaSingleLayout } from '@atlaskit/adf-schema';
import {
  ErrorReporter,
  ContextIdentifierProvider,
} from '@atlaskit/editor-common';

import analyticsService from '../../../analytics/service';
import { isImage } from '../../../utils';
import { Dispatch } from '../../../event-dispatcher';
import { ProsemirrorGetPosHandler } from '../../../nodeviews';
import DropPlaceholder, { PlaceholderType } from '../ui/Media/DropPlaceholder';
import { MediaPluginOptions } from '../media-plugin-options';
import { insertMediaGroupNode } from '../utils/media-files';
import {
  removeMediaNode,
  splitMediaGroup,
  getViewMediaClientConfigFromMediaProvider,
  getUploadMediaClientConfigFromMediaProvider,
} from '../utils/media-common';
import PickerFacade, {
  PickerFacadeConfig,
  MediaStateEventListener,
  MediaStateEventSubscriber,
} from '../picker-facade';
import { MediaState, MediaProvider, MediaStateStatus } from '../types';
import { insertMediaSingleNode, isMediaSingle } from '../utils/media-single';
import {
  INPUT_METHOD,
  InputMethodInsertMedia,
} from '../../../plugins/analytics';
import * as helpers from '../commands/helpers';
import { updateMediaNodeAttrs } from '../commands';
import { MediaPMPluginOptions } from '..';

export { MediaState, MediaProvider, MediaStateStatus };

const MEDIA_RESOLVED_STATES = ['ready', 'error', 'cancelled'];

export interface MediaNodeWithPosHandler {
  node: PMNode;
  getPos: ProsemirrorGetPosHandler;
}

export class MediaPluginState {
  public allowsUploads: boolean = false;
  public mediaClientConfig?: MediaClientConfig;
  public uploadMediaClientConfig?: MediaClientConfig;
  public ignoreLinks: boolean = false;
  public waitForMediaUpload: boolean = true;
  public allUploadsFinished: boolean = true;
  public showDropzone: boolean = false;
  public element?: HTMLElement;
  public layout: MediaSingleLayout = 'center';
  public mediaNodes: MediaNodeWithPosHandler[] = [];
  public mediaGroupNodes: Record<string, any> = {};
  public mobileUploadComplete: Record<string, boolean> = {};
  private pendingTask = Promise.resolve<MediaState | null>(null);
  public options: MediaPluginOptions;
  private view!: EditorView;
  private destroyed = false;
  public mediaProvider?: MediaProvider;
  private contextIdentifierProvider?: ContextIdentifierProvider;
  private errorReporter: ErrorReporter;

  public pickers: PickerFacade[] = [];
  public pickerPromises: Array<Promise<PickerFacade>> = [];
  private popupPicker?: PickerFacade;
  // @ts-ignore
  private customPicker?: PickerFacade;

  public editingMediaSinglePos?: number;
  public showEditingDialog?: boolean;
  public mediaPluginOptions?: MediaPMPluginOptions;

  private removeOnCloseListener: () => void = () => {};
  private openMediaPickerBrowser?: () => void;
  private onPopupToogleCallback: (isOpen: boolean) => void = () => {};

  private reactContext: () => {};

  constructor(
    state: EditorState,
    options: MediaPluginOptions,
    reactContext: () => {},
    mediaPluginOptions?: MediaPMPluginOptions,
  ) {
    this.reactContext = reactContext;
    this.options = options;
    this.mediaPluginOptions = mediaPluginOptions;
    this.waitForMediaUpload =
      options.waitForMediaUpload === undefined
        ? true
        : options.waitForMediaUpload;

    const { nodes } = state.schema;
    assert(
      nodes.media && (nodes.mediaGroup || nodes.mediaSingle),
      'Editor: unable to init media plugin - media or mediaGroup/mediaSingle node absent in schema',
    );

    options.providerFactory.subscribe(
      'mediaProvider',
      (_name, provider?: Promise<MediaProvider>) =>
        this.setMediaProvider(provider),
    );

    options.providerFactory.subscribe(
      'contextIdentifierProvider',
      this.onContextIdentifierProvider,
    );

    this.errorReporter = options.errorReporter || new ErrorReporter();
  }

  onContextIdentifierProvider = async (
    _name: string,
    provider?: Promise<ContextIdentifierProvider>,
  ) => {
    if (provider) {
      this.contextIdentifierProvider = await provider;
    }
  };

  setMediaProvider = async (mediaProvider?: Promise<MediaProvider>) => {
    if (!mediaProvider) {
      this.destroyPickers();

      this.allowsUploads = false;
      if (!this.destroyed) {
        this.view.dispatch(
          this.view.state.tr.setMeta(stateKey, {
            allowsUploads: this.allowsUploads,
          }),
        );
      }

      return;
    }

    // TODO disable (not destroy!) pickers until mediaProvider is resolved
    try {
      this.mediaProvider = await mediaProvider;

      // TODO [MS-2038]: remove once context api is removed
      // We want to re assign the view and upload configs if they are missing for backwards compatibility
      // as currently integrators can pass context || mediaClientConfig
      if (!this.mediaProvider.viewMediaClientConfig) {
        const viewMediaClientConfig = await getViewMediaClientConfigFromMediaProvider(
          this.mediaProvider,
        );

        if (viewMediaClientConfig) {
          (this
            .mediaProvider as MediaProvider).viewMediaClientConfig = viewMediaClientConfig;
        }
      }

      if (!this.mediaProvider.uploadMediaClientConfig) {
        this.mediaProvider.uploadMediaClientConfig = await getUploadMediaClientConfigFromMediaProvider(
          this.mediaProvider,
        );
      }

      assert(
        this.mediaProvider.viewMediaClientConfig,
        `MediaProvider promise did not resolve to a valid instance of MediaProvider - ${
          this.mediaProvider
        }`,
      );
    } catch (err) {
      const wrappedError = new Error(
        `Media functionality disabled due to rejected provider: ${err.message}`,
      );
      this.errorReporter.captureException(wrappedError);

      this.destroyPickers();

      this.allowsUploads = false;
      if (!this.destroyed) {
        this.view.dispatch(
          this.view.state.tr.setMeta(stateKey, {
            allowsUploads: this.allowsUploads,
          }),
        );
      }

      return;
    }

    this.mediaClientConfig = await this.mediaProvider.viewMediaClientConfig;

    this.allowsUploads = !!(
      this.mediaProvider.uploadContext ||
      this.mediaProvider.uploadMediaClientConfig
    );
    const { view, allowsUploads } = this;

    // make sure editable DOM node is mounted
    if (!this.destroyed && view.dom.parentNode) {
      // make PM plugin aware of the state change to update UI during 'apply' hook
      view.dispatch(view.state.tr.setMeta(stateKey, { allowsUploads }));
    }

    if (this.allowsUploads) {
      this.uploadMediaClientConfig = await this.mediaProvider
        .uploadMediaClientConfig;

      if (this.mediaProvider.uploadParams && this.uploadMediaClientConfig) {
        await this.initPickers(
          this.mediaProvider.uploadParams,
          PickerFacade,
          this.reactContext,
        );
      } else {
        this.destroyPickers();
      }
    } else {
      this.destroyPickers();
    }
  };

  getMediaOptions = () => this.options;

  updateElement(): void {
    let newElement;
    const selectedContainer = this.selectedMediaContainerNode();
    const { mediaSingle } = this.view.state.schema.nodes;

    if (selectedContainer && selectedContainer.type === mediaSingle) {
      newElement = this.getDomElement(this.view.domAtPos.bind(this.view)) as
        | HTMLElement
        | undefined;
    }
    if (this.element !== newElement) {
      this.element = newElement;
    }
  }

  hasUserAuthProvider = () =>
    this.uploadMediaClientConfig &&
    this.uploadMediaClientConfig.userAuthProvider;

  private getDomElement(domAtPos: EditorView['domAtPos']) {
    const { selection, schema } = this.view.state;
    if (!(selection instanceof NodeSelection)) {
      return;
    }

    if (selection.node.type !== schema.nodes.mediaSingle) {
      return;
    }

    const node = findDomRefAtPos(selection.from, domAtPos);
    if (node) {
      if (!node.childNodes.length) {
        return node.parentNode as HTMLElement | undefined;
      }

      const target = (node as HTMLElement).querySelector('.wrapper') || node;
      return target;
    }
    return;
  }

  /**
   * we insert a new file by inserting a initial state for that file.
   *
   * called when we insert a new file via the picker (connected via pickerfacade)
   */
  insertFile = (
    mediaState: MediaState,
    onMediaStateChanged: MediaStateEventSubscriber,
    pickerType?: string,
  ) => {
    const mediaStateWithContext: MediaState = {
      ...mediaState,
      contextId: this.contextIdentifierProvider
        ? this.contextIdentifierProvider.objectId
        : undefined,
    };

    const collection = this.collectionFromProvider();
    if (collection === undefined) {
      return;
    }

    if (
      this.mediaPluginOptions &&
      this.mediaPluginOptions.allowMarkingUploadsAsIncomplete
    ) {
      this.mobileUploadComplete[mediaStateWithContext.id] = false;
    }

    this.allUploadsFinished = false;

    if (
      isMediaSingle(this.view.state.schema, mediaStateWithContext.fileMimeType)
    ) {
      insertMediaSingleNode(
        this.view,
        mediaStateWithContext,
        this.getInputMethod(pickerType),
        collection,
      );
    } else {
      insertMediaGroupNode(this.view, [mediaStateWithContext], collection);
    }

    // do events when media state changes
    onMediaStateChanged(this.handleMediaState);

    // handle waiting for upload complete
    const isEndState = (state: MediaState) =>
      state.status && MEDIA_RESOLVED_STATES.indexOf(state.status) !== -1;

    if (!isEndState(mediaStateWithContext)) {
      const updater = (promise: Promise<any>) => {
        // Chain the previous promise with a new one for this media item
        return new Promise<MediaState | null>(resolve => {
          const onStateChange: MediaStateEventListener = newState => {
            // When media item reaches its final state, remove listener and resolve
            if (isEndState(newState)) {
              resolve(newState);
            }
          };

          onMediaStateChanged(onStateChange);
        }).then(() => promise);
      };
      this.pendingTask = updater(this.pendingTask);

      this.pendingTask.then(() => {
        this.allUploadsFinished = true;
      });
    }

    // refocus the view
    const { view } = this;
    if (!view.hasFocus()) {
      view.focus();
    }
  };

  splitMediaGroup = (): boolean => splitMediaGroup(this.view);

  onPopupPickerClose = () => {
    this.onPopupToogleCallback(false);
  };

  showMediaPicker = () => {
    if (this.openMediaPickerBrowser && !this.hasUserAuthProvider()) {
      return this.openMediaPickerBrowser();
    }
    if (!this.popupPicker) {
      return;
    }
    this.popupPicker.show();
    this.onPopupToogleCallback(true);
  };

  setBrowseFn = (browseFn: () => void) => {
    this.openMediaPickerBrowser = browseFn;
  };

  onPopupToggle = (onPopupToogleCallback: (isOpen: boolean) => void) => {
    this.onPopupToogleCallback = onPopupToogleCallback;
  };

  /**
   * Returns a promise that is resolved after all pending operations have been finished.
   * An optional timeout will cause the promise to reject if the operation takes too long
   *
   * NOTE: The promise will resolve even if some of the media have failed to process.
   */
  waitForPendingTasks = (
    timeout?: number,
    lastTask?: Promise<MediaState | null>,
  ) => {
    if (lastTask && this.pendingTask === lastTask) {
      return lastTask;
    }

    const chainedPromise: Promise<any> = this.pendingTask.then(() =>
      // Call ourselves to make sure that no new pending tasks have been
      // added before the current promise has resolved.
      this.waitForPendingTasks(undefined, this.pendingTask!),
    );

    if (!timeout) {
      return chainedPromise;
    }

    let rejectTimeout: number;
    const timeoutPromise = new Promise((_resolve, reject) => {
      rejectTimeout = window.setTimeout(
        () =>
          reject(new Error(`Media operations did not finish in ${timeout} ms`)),
        timeout,
      );
    });

    return Promise.race([
      timeoutPromise,
      chainedPromise.then(() => {
        clearTimeout(rejectTimeout);
      }),
    ]);
  };

  setView(view: EditorView) {
    this.view = view;
  }

  /**
   * Called from React UI Component when user clicks on "Delete" icon
   * inside of it
   */
  handleMediaNodeRemoval = (
    node: PMNode | undefined,
    getPos: ProsemirrorGetPosHandler,
  ) => {
    let getNode = node;
    if (!getNode) {
      getNode = this.view.state.doc.nodeAt(getPos()) as PMNode;
    }
    removeMediaNode(this.view, getNode, getPos);
  };

  /**
   * Called from React UI Component on componentDidMount
   */
  handleMediaNodeMount = (node: PMNode, getPos: ProsemirrorGetPosHandler) => {
    this.mediaNodes.unshift({ node, getPos });
  };

  /**
   * Called from React UI Component on componentWillUnmount and UNSAFE_componentWillReceiveProps
   * when React component's underlying node property is replaced with a new node
   */
  handleMediaNodeUnmount = (oldNode: PMNode) => {
    this.mediaNodes = this.mediaNodes.filter(({ node }) => oldNode !== node);
  };

  destroy() {
    if (this.destroyed) {
      return;
    }

    this.destroyed = true;

    const { mediaNodes } = this;
    mediaNodes.splice(0, mediaNodes.length);

    this.removeOnCloseListener();
    this.destroyPickers();
  }

  findMediaNode = (id: string): MediaNodeWithPosHandler | null => {
    return helpers.findMediaSingleNode(this, id);
  };

  private destroyAllPickers = (pickers: Array<PickerFacade>) => {
    pickers.forEach(picker => picker.destroy());
    this.pickers.splice(0, this.pickers.length);
  };

  private destroyPickers = () => {
    const { pickers, pickerPromises } = this;

    // If pickerPromises and pickers are the same length
    // All pickers have resolved and we safely destroy them
    // Otherwise wait for them to resolve then destroy.
    if (pickerPromises.length === pickers.length) {
      this.destroyAllPickers(this.pickers);
    } else {
      Promise.all(pickerPromises).then(resolvedPickers =>
        this.destroyAllPickers(resolvedPickers),
      );
    }

    this.popupPicker = undefined;
    this.customPicker = undefined;
  };

  private async initPickers(
    uploadParams: UploadParams,
    Picker: typeof PickerFacade,
    reactContext: () => {},
  ) {
    if (this.destroyed || !this.uploadMediaClientConfig) {
      return;
    }
    const { errorReporter, pickers, pickerPromises } = this;
    // create pickers if they don't exist, re-use otherwise
    if (!pickers.length) {
      const pickerFacadeConfig: PickerFacadeConfig = {
        mediaClientConfig: this.uploadMediaClientConfig,
        errorReporter,
      };
      const defaultPickerConfig = {
        uploadParams,
        proxyReactContext: reactContext(),
      };

      if (this.options.customMediaPicker) {
        const customPicker = new Picker(
          'customMediaPicker',
          pickerFacadeConfig,
          this.options.customMediaPicker,
        ).init();

        pickerPromises.push(customPicker);
        pickers.push((this.customPicker = await customPicker));
      } else if (this.hasUserAuthProvider()) {
        const popupPicker = new Picker(
          'popup',
          pickerFacadeConfig,
          defaultPickerConfig as PopupConfig,
        ).init();
        pickerPromises.push(popupPicker);
        pickers.push((this.popupPicker = await popupPicker));
        this.removeOnCloseListener = this.popupPicker.onClose(
          this.onPopupPickerClose,
        );
      }

      pickers.forEach(picker => {
        picker.onNewMedia(this.insertFile);
        picker.onNewMedia(this.trackNewMediaEvent);
      });
    }

    // set new upload params for the pickers
    pickers.forEach(picker => picker.setUploadParams(uploadParams));
  }

  public trackNewMediaEvent(
    mediaState: MediaState,
    onMediaStateChanged: MediaStateEventSubscriber,
    pickerType?: string,
  ) {
    analyticsService.trackEvent(
      `atlassian.editor.media.file.${pickerType}`,
      mediaState.fileMimeType ? { fileMimeType: mediaState.fileMimeType } : {},
    );
  }

  private getInputMethod = (
    pickerType?: string,
  ): InputMethodInsertMedia | undefined => {
    switch (pickerType) {
      case 'popup':
        return INPUT_METHOD.PICKER_CLOUD;
      case 'clipboard':
        return INPUT_METHOD.CLIPBOARD;
      case 'dropzone':
        return INPUT_METHOD.DRAG_AND_DROP;
    }
    return;
  };

  updateMediaNodeAttrs = (
    id: string,
    attrs: object,
    isMediaSingle: boolean,
  ) => {
    const { view } = this;
    if (!view) {
      return;
    }

    return updateMediaNodeAttrs(id, attrs, isMediaSingle)(
      view.state,
      view.dispatch,
    );
  };

  private collectionFromProvider(): string | undefined {
    return (
      this.mediaProvider &&
      this.mediaProvider.uploadParams &&
      this.mediaProvider.uploadParams.collection
    );
  }

  private handleMediaState: MediaStateEventListener = state => {
    switch (state.status) {
      case 'error':
        const { uploadErrorHandler } = this.options;
        if (uploadErrorHandler) {
          uploadErrorHandler(state);
        }
        break;

      case 'mobile-upload-end':
        const attrs: { id: string; collection?: string } = {
          id: state.publicId || state.id,
        };

        if (typeof state.collection === 'string') {
          attrs.collection = state.collection;
        }

        this.updateMediaNodeAttrs(
          state.id,
          attrs,
          isMediaSingle(this.view.state.schema, state.fileMimeType),
        );

        // mark mobile upload as complete
        this.mobileUploadComplete[attrs.id] = true;

        delete this.mediaGroupNodes[state.id];
        break;
    }
  };

  isMobileUploadCompleted = (mediaId: string) =>
    helpers.isMobileUploadCompleted(this, mediaId);

  removeNodeById = (state: MediaState) => {
    const { id } = state;
    const mediaNodeWithPos = helpers.findMediaNode(
      this,
      id,
      isImage(state.fileMimeType),
    );

    if (mediaNodeWithPos) {
      removeMediaNode(
        this.view,
        mediaNodeWithPos.node,
        mediaNodeWithPos.getPos,
      );
    }
  };

  removeSelectedMediaContainer = (): boolean => {
    const { view } = this;

    const selectedNode = this.selectedMediaContainerNode();
    if (!selectedNode) {
      return false;
    }

    let { from } = view.state.selection;
    removeMediaNode(view, selectedNode.firstChild!, () => from + 1);
    return true;
  };

  selectedMediaContainerNode = (): Node | undefined => {
    const { selection, schema } = this.view.state;
    if (
      selection instanceof NodeSelection &&
      (selection.node.type === schema.nodes.mediaSingle ||
        selection.node.type === schema.nodes.mediaGroup)
    ) {
      return selection.node;
    }
    return;
  };

  handleDrag = (dragState: 'enter' | 'leave') => {
    const isActive = dragState === 'enter';
    if (this.showDropzone === isActive) {
      return;
    }
    this.showDropzone = isActive;

    const { dispatch, state } = this.view;
    // Trigger state change to be able to pick it up in the decorations handler
    dispatch(state.tr);
  };
}

const createDropPlaceholder = (allowDropLine?: boolean) => {
  const dropPlaceholder = document.createElement('div');
  if (allowDropLine) {
    ReactDOM.render(
      React.createElement(DropPlaceholder, { type: 'single' } as {
        type: PlaceholderType;
      }),
      dropPlaceholder,
    );
  } else {
    ReactDOM.render(React.createElement(DropPlaceholder), dropPlaceholder);
  }
  return dropPlaceholder;
};

export const stateKey = new PluginKey('mediaPlugin');
export const getMediaPluginState = (state: EditorState) =>
  stateKey.getState(state) as MediaPluginState;

export const createPlugin = (
  _schema: Schema,
  options: MediaPluginOptions,
  reactContext: () => {},
  dispatch?: Dispatch,
  mediaPluginOptions?: MediaPMPluginOptions,
) => {
  const dropPlaceholder = createDropPlaceholder(
    mediaPluginOptions && mediaPluginOptions.allowDropzoneDropLine,
  );

  return new Plugin({
    state: {
      init(_config, state) {
        return new MediaPluginState(
          state,
          options,
          reactContext,
          mediaPluginOptions,
        );
      },
      apply(tr, pluginState: MediaPluginState) {
        // remap editing media single position if we're in collab
        if (typeof pluginState.editingMediaSinglePos === 'number') {
          pluginState.editingMediaSinglePos = tr.mapping.map(
            pluginState.editingMediaSinglePos,
          );
        }

        const meta = tr.getMeta(stateKey);
        if (meta && dispatch) {
          const { showMediaPicker } = pluginState;
          const { allowsUploads } = meta;
          dispatch(stateKey, {
            ...pluginState,
            allowsUploads:
              typeof allowsUploads === 'undefined'
                ? pluginState.allowsUploads
                : allowsUploads,
            showMediaPicker,
          });
        }

        // NOTE: We're not calling passing new state to the Editor, because we depend on the view.state reference
        //       throughout the lifetime of view. We injected the view into the plugin state, because we dispatch()
        //       transformations from within the plugin state (i.e. when adding a new file).
        return pluginState;
      },
    },
    key: stateKey,
    view: view => {
      const pluginState = getMediaPluginState(view.state);
      pluginState.setView(view);
      pluginState.updateElement();

      return {
        update: () => {
          pluginState.updateElement();
        },
      };
    },
    props: {
      decorations: state => {
        const pluginState = getMediaPluginState(state);
        if (!pluginState.showDropzone) {
          return;
        }

        const {
          schema,
          selection: { $anchor },
        } = state;

        // When a media is already selected
        if (state.selection instanceof NodeSelection) {
          const node = state.selection.node;

          if (node.type === schema.nodes.mediaSingle) {
            const deco = Decoration.node(
              state.selection.from,
              state.selection.to,
              {
                class: 'mediaSingle-selected',
              },
            );

            return DecorationSet.create(state.doc, [deco]);
          }

          return;
        }

        let pos: number | null | void = $anchor.pos;
        if (
          $anchor.parent.type !== schema.nodes.paragraph &&
          $anchor.parent.type !== schema.nodes.codeBlock
        ) {
          pos = insertPoint(state.doc, pos, schema.nodes.mediaGroup);
        }

        if (pos === null || pos === undefined) {
          return;
        }

        const dropPlaceholders: Decoration[] = [
          Decoration.widget(pos, dropPlaceholder, { key: 'drop-placeholder' }),
        ];
        return DecorationSet.create(state.doc, dropPlaceholders);
      },
      nodeViews: options.nodeViews,
      handleTextInput(view: EditorView): boolean {
        getMediaPluginState(view.state).splitMediaGroup();
        return false;
      },
    },
  });
};
