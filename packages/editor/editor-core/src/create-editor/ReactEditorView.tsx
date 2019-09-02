import * as React from 'react';
import * as PropTypes from 'prop-types';
import { EditorState, Transaction, Selection } from 'prosemirror-state';
import { EditorView, DirectEditorProps } from 'prosemirror-view';
import { Node as PMNode } from 'prosemirror-model';
import { intlShape } from 'react-intl';
import { CreateUIAnalyticsEvent } from '@atlaskit/analytics-next';
import {
  ProviderFactory,
  Transformer,
  ErrorReporter,
  browser,
  measureRender,
  getResponseEndTime,
} from '@atlaskit/editor-common';

import { EventDispatcher, createDispatch, Dispatch } from '../event-dispatcher';
import { processRawValue } from '../utils';
import { findChangedNodesFromTransaction, validateNodes } from '../utils/nodes';
import createPluginList from './create-plugins-list';
import {
  analyticsEventKey,
  fireAnalyticsEvent,
  AnalyticsDispatch,
  AnalyticsEventPayload,
  DispatchAnalyticsEvent,
  ACTION,
  ACTION_SUBJECT,
  EVENT_TYPE,
  FULL_WIDTH_MODE,
  PLATFORMS,
  AnalyticsEventPayloadWithChannel,
  analyticsPluginKey,
} from '../plugins/analytics';
import {
  EditorProps,
  EditorConfig,
  EditorPlugin,
  EditorAppearance,
} from '../types';
import { PortalProviderAPI } from '../ui/PortalProvider';
import {
  pluginKey as editorDisabledPluginKey,
  EditorDisabledPluginState,
} from '../plugins/editor-disabled';
import { analyticsService } from '../analytics';
import {
  processPluginsList,
  createSchema,
  createErrorReporter,
  createPMPlugins,
  initAnalytics,
} from './create-editor';
import { getDocStructure } from '../utils/document-logger';
import { isFullPage } from '../utils/is-full-page';
import measurements from '../utils/performance/measure-enum';
import { getNodesCount } from '../utils/document';

export interface EditorViewProps {
  editorProps: EditorProps;
  createAnalyticsEvent?: CreateUIAnalyticsEvent;
  providerFactory: ProviderFactory;
  portalProviderAPI: PortalProviderAPI;
  allowAnalyticsGASV3?: boolean;
  disabled?: boolean;
  render?: (
    props: {
      editor: JSX.Element;
      view?: EditorView;
      config: EditorConfig;
      eventDispatcher: EventDispatcher;
      transformer?: Transformer<string>;
      dispatchAnalyticsEvent: DispatchAnalyticsEvent;
    },
  ) => JSX.Element;
  onEditorCreated: (
    instance: {
      view: EditorView;
      config: EditorConfig;
      eventDispatcher: EventDispatcher;
      transformer?: Transformer<string>;
    },
  ) => void;
  onEditorDestroyed: (
    instance: {
      view: EditorView;
      config: EditorConfig;
      eventDispatcher: EventDispatcher;
      transformer?: Transformer<string>;
    },
  ) => void;
}

function handleEditorFocus(view: EditorView) {
  if (view.hasFocus()) {
    return;
  }

  window.setTimeout(() => {
    view.focus();
  }, 0);
}

export default class ReactEditorView<T = {}> extends React.Component<
  EditorViewProps & T
> {
  view?: EditorView;
  eventDispatcher: EventDispatcher;
  contentTransformer?: Transformer<string>;
  config!: EditorConfig;
  editorState: EditorState;
  errorReporter: ErrorReporter;
  dispatch: Dispatch;
  analyticsEventHandler!: (
    payloadChannel: {
      payload: AnalyticsEventPayload;
      channel?: string;
    },
  ) => void;

  static contextTypes = {
    getAtlaskitAnalyticsEventHandlers: PropTypes.func,
    intl: intlShape,
  };

  constructor(props: EditorViewProps & T) {
    super(props);

    this.eventDispatcher = new EventDispatcher();
    this.dispatch = createDispatch(this.eventDispatcher);
    this.errorReporter = createErrorReporter(
      props.editorProps.errorReporterHandler,
    );
    this.editorState = this.createEditorState({ props, replaceDoc: true });

    const { createAnalyticsEvent, allowAnalyticsGASV3 } = props;
    if (allowAnalyticsGASV3) {
      this.activateAnalytics(createAnalyticsEvent);
    }
    initAnalytics(props.editorProps.analyticsHandler);

    this.dispatchAnalyticsEvent({
      action: ACTION.STARTED,
      actionSubject: ACTION_SUBJECT.EDITOR,
      attributes: { platform: PLATFORMS.WEB },
      eventType: EVENT_TYPE.UI,
    });
  }

  private broadcastDisabled = (disabled: boolean) => {
    const editorView = this.view;
    if (editorView) {
      const tr = editorView.state.tr.setMeta(editorDisabledPluginKey, {
        editorDisabled: disabled,
      } as EditorDisabledPluginState);

      tr.setMeta('isLocal', true);
      editorView.dispatch(tr);
    }
  };

  UNSAFE_componentWillReceiveProps(nextProps: EditorViewProps) {
    if (
      this.view &&
      this.props.editorProps.disabled !== nextProps.editorProps.disabled
    ) {
      this.broadcastDisabled(!!nextProps.editorProps.disabled);
      // Disables the contentEditable attribute of the editor if the editor is disabled
      this.view.setProps({
        editable: _state => !nextProps.editorProps.disabled,
      } as DirectEditorProps);

      if (
        !nextProps.editorProps.disabled &&
        nextProps.editorProps.shouldFocus
      ) {
        handleEditorFocus(this.view);
      }
    }

    // Activate or deactivate analytics if change property
    if (this.props.allowAnalyticsGASV3 !== nextProps.allowAnalyticsGASV3) {
      if (nextProps.allowAnalyticsGASV3) {
        this.activateAnalytics(nextProps.createAnalyticsEvent);
      } else {
        this.deactivateAnalytics();
      }
    } else {
      // Allow analytics is the same, check if we receive a new create analytics prop
      if (
        this.props.allowAnalyticsGASV3 &&
        nextProps.createAnalyticsEvent !== this.props.createAnalyticsEvent
      ) {
        this.deactivateAnalytics(); // Deactivate the old one
        this.activateAnalytics(nextProps.createAnalyticsEvent); // Activate the new one
      }
    }

    const { appearance } = this.props.editorProps;
    const { appearance: nextAppearance } = nextProps.editorProps;
    if (nextAppearance !== appearance) {
      this.reconfigureState(nextProps);
      if (nextAppearance === 'full-width' || appearance === 'full-width') {
        this.dispatchAnalyticsEvent({
          action: ACTION.CHANGED_FULL_WIDTH_MODE,
          actionSubject: ACTION_SUBJECT.EDITOR,
          eventType: EVENT_TYPE.TRACK,
          attributes: {
            previousMode: this.formatFullWidthAppearance(appearance),
            newMode: this.formatFullWidthAppearance(nextAppearance),
          },
        });
      }
    }
  }

  formatFullWidthAppearance = (
    appearance: EditorAppearance | undefined,
  ): FULL_WIDTH_MODE => {
    if (appearance === 'full-width') {
      return FULL_WIDTH_MODE.FULL_WIDTH;
    }
    return FULL_WIDTH_MODE.FIXED_WIDTH;
  };

  reconfigureState = (props: EditorViewProps) => {
    if (!this.view) {
      return;
    }

    // We cannot currently guarentee when all the portals will have re-rendered during a reconfigure
    // so we blur here to stop ProseMirror from trying to apply selection to detached nodes or
    // nodes that haven't been re-rendered to the document yet.
    if (this.view.dom instanceof HTMLElement && this.view.hasFocus()) {
      this.view.dom.blur();
    }

    this.config = processPluginsList(
      this.getPlugins(
        props.editorProps,
        this.props.editorProps,
        props.createAnalyticsEvent,
      ),
      props.editorProps,
    );

    const state = this.editorState;
    const plugins = createPMPlugins({
      schema: state.schema,
      dispatch: this.dispatch,
      errorReporter: this.errorReporter,
      editorConfig: this.config,
      props: props.editorProps,
      prevProps: this.props.editorProps,
      eventDispatcher: this.eventDispatcher,
      providerFactory: props.providerFactory,
      portalProviderAPI: props.portalProviderAPI,
      reactContext: () => this.context,
      dispatchAnalyticsEvent: this.dispatchAnalyticsEvent,
    });

    const newState = state.reconfigure({ plugins });

    // need to update the state first so when the view builds the nodeviews it is
    // using the latest plugins
    this.view.updateState(newState);

    return this.view.update({ ...this.view.props, state: newState });
  };

  /**
   * Deactivate analytics event handler, if exist any.
   */
  deactivateAnalytics() {
    if (this.analyticsEventHandler) {
      this.eventDispatcher.off(analyticsEventKey, this.analyticsEventHandler);
    }
  }

  /**
   * Create analytics event handler, if createAnalyticsEvent exist
   * @param createAnalyticsEvent
   */
  activateAnalytics(createAnalyticsEvent?: CreateUIAnalyticsEvent) {
    if (createAnalyticsEvent) {
      this.analyticsEventHandler = fireAnalyticsEvent(createAnalyticsEvent);
      this.eventDispatcher.on(analyticsEventKey, this.analyticsEventHandler);
    }
  }

  /**
   * Clean up any non-PM resources when the editor is unmounted
   */
  componentWillUnmount() {
    this.eventDispatcher.destroy();

    if (this.view) {
      // Destroy the state if the Editor is being unmounted
      const editorState = this.view.state;
      editorState.plugins.forEach(plugin => {
        const state = plugin.getState(editorState);
        if (state && state.destroy) {
          state.destroy();
        }
      });
    }
    // this.view will be destroyed when React unmounts in handleEditorViewRef
  }

  // Helper to allow tests to inject plugins directly
  getPlugins(
    editorProps: EditorProps,
    prevEditorProps?: EditorProps,
    createAnalyticsEvent?: CreateUIAnalyticsEvent,
  ): EditorPlugin[] {
    return createPluginList(editorProps, prevEditorProps, createAnalyticsEvent);
  }

  createEditorState = (options: {
    props: EditorViewProps;
    replaceDoc?: boolean;
  }) => {
    if (this.view) {
      /**
       * There's presently a number of issues with changing the schema of a
       * editor inflight. A significant issue is that we lose the ability
       * to keep track of a user's history as the internal plugin state
       * keeps a list of Steps to undo/redo (which are tied to the schema).
       * Without a good way to do work around this, we prevent this for now.
       */
      // eslint-disable-next-line no-console
      console.warn(
        'The editor does not support changing the schema dynamically.',
      );
      return this.editorState;
    }

    this.config = processPluginsList(
      this.getPlugins(
        options.props.editorProps,
        undefined,
        options.props.createAnalyticsEvent,
      ),
      options.props.editorProps,
    );
    const schema = createSchema(this.config);

    const {
      contentTransformerProvider,
      defaultValue,
    } = options.props.editorProps;

    const plugins = createPMPlugins({
      schema,
      dispatch: this.dispatch,
      errorReporter: this.errorReporter,
      editorConfig: this.config,
      props: options.props.editorProps,
      eventDispatcher: this.eventDispatcher,
      providerFactory: options.props.providerFactory,
      portalProviderAPI: this.props.portalProviderAPI,
      reactContext: () => this.context,
      dispatchAnalyticsEvent: this.dispatchAnalyticsEvent,
    });

    this.contentTransformer = contentTransformerProvider
      ? contentTransformerProvider(schema)
      : undefined;

    let doc;
    if (options.replaceDoc) {
      doc =
        this.contentTransformer && typeof defaultValue === 'string'
          ? this.contentTransformer.parse(defaultValue)
          : processRawValue(
              schema,
              defaultValue,
              options.props.providerFactory,
              options.props.editorProps.sanitizePrivateContent,
            );
    }
    let selection: Selection | undefined;
    if (doc) {
      // ED-4759: Don't set selection at end for full-page editor - should be at start
      selection = isFullPage(options.props.editorProps.appearance)
        ? Selection.atStart(doc)
        : Selection.atEnd(doc);
    }
    // Workaround for ED-3507: When media node is the last element, scrollIntoView throws an error
    const patchedSelection = selection
      ? Selection.findFrom(selection.$head, -1, true) || undefined
      : undefined;

    return EditorState.create({
      schema,
      plugins,
      doc,
      selection: patchedSelection,
    });
  };

  getDirectEditorProps = (state?: EditorState): DirectEditorProps => {
    return {
      state: state || this.editorState,
      dispatchTransaction: (transaction: Transaction) => {
        if (!this.view) {
          return;
        }

        const nodes: PMNode[] = findChangedNodesFromTransaction(transaction);
        if (validateNodes(nodes)) {
          // go ahead and update the state now we know the transaction is good
          const editorState = this.view.state.apply(transaction);
          this.view.updateState(editorState);
          if (this.props.editorProps.onChange && transaction.docChanged) {
            this.props.editorProps.onChange(this.view);
          }
          this.editorState = editorState;
        } else {
          const documents = {
            new: getDocStructure(transaction.doc),
            prev: getDocStructure(transaction.docs[0]),
          };
          analyticsService.trackEvent(
            'atlaskit.fabric.editor.invalidtransaction',
            { documents: JSON.stringify(documents) }, // V2 events don't support object properties
          );
          this.dispatchAnalyticsEvent({
            action: ACTION.DISPATCHED_INVALID_TRANSACTION,
            actionSubject: ACTION_SUBJECT.EDITOR,
            eventType: EVENT_TYPE.OPERATIONAL,
            attributes: {
              analyticsEventPayloads: transaction.getMeta(
                analyticsPluginKey,
              ) as AnalyticsEventPayloadWithChannel[],
              documents,
            },
          });
        }
      },
      // Disables the contentEditable attribute of the editor if the editor is disabled
      editable: _state => !this.props.editorProps.disabled,
      attributes: { 'data-gramm': 'false' },
    };
  };

  createEditorView = (node: HTMLDivElement) => {
    measureRender(measurements.PROSEMIRROR_RENDERED, (duration, startTime) => {
      if (this.view) {
        this.dispatchAnalyticsEvent({
          action: ACTION.PROSEMIRROR_RENDERED,
          actionSubject: ACTION_SUBJECT.EDITOR,
          attributes: {
            duration,
            startTime,
            nodes: getNodesCount(this.view.state.doc),
            ttfb: getResponseEndTime(),
          },
          eventType: EVENT_TYPE.OPERATIONAL,
        });
      }
    });

    // Creates the editor-view from this.editorState. If an editor has been mounted
    // previously, this will contain the previous state of the editor.
    this.view = new EditorView({ mount: node }, this.getDirectEditorProps());
  };

  handleEditorViewRef = (node: HTMLDivElement) => {
    if (!this.view && node) {
      this.createEditorView(node);
      const view = this.view!;
      this.props.onEditorCreated({
        view,
        config: this.config,
        eventDispatcher: this.eventDispatcher,
        transformer: this.contentTransformer,
      });

      if (
        this.props.editorProps.shouldFocus &&
        (view.props.editable && view.props.editable(view.state))
      ) {
        handleEditorFocus(view);
      }

      // Set the state of the EditorDisabled plugin to the current value
      this.broadcastDisabled(!!this.props.editorProps.disabled);

      // Force React to re-render so consumers get a reference to the editor view
      this.forceUpdate();
    } else if (this.view && !node) {
      // When the appearance is changed, React will call handleEditorViewRef with node === null
      // to destroy the old EditorView, before calling this method again with node === div to
      // create the new EditorView
      this.props.onEditorDestroyed({
        view: this.view,
        config: this.config,
        eventDispatcher: this.eventDispatcher,
        transformer: this.contentTransformer,
      });
      this.view.destroy(); // Destroys the dom node & all node views
      this.view = undefined;
    }
  };

  dispatchAnalyticsEvent = (payload: AnalyticsEventPayload): void => {
    if (this.props.allowAnalyticsGASV3 && this.eventDispatcher) {
      const dispatch: AnalyticsDispatch = createDispatch(this.eventDispatcher);
      dispatch(analyticsEventKey, {
        payload,
      });
    }
  };

  render() {
    const editor = (
      <div
        className={getUAPrefix()}
        key="ProseMirror"
        ref={this.handleEditorViewRef}
      />
    );
    return this.props.render
      ? this.props.render({
          editor,
          view: this.view,
          config: this.config,
          eventDispatcher: this.eventDispatcher,
          transformer: this.contentTransformer,
          dispatchAnalyticsEvent: this.dispatchAnalyticsEvent,
        })
      : editor;
  }
}

function getUAPrefix() {
  if (browser.chrome) {
    return 'ua-chrome';
  } else if (browser.ie) {
    return 'ua-ie';
  } else if (browser.gecko) {
    return 'ua-firefox';
  }

  return '';
}
