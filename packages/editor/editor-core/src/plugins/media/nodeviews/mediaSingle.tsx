import * as React from 'react';
import { Component } from 'react';
import { Node as PMNode } from 'prosemirror-model';
import { EditorView, Decoration } from 'prosemirror-view';
import { MediaSingleLayout } from '@atlaskit/adf-schema';
import {
  MediaSingle,
  WithProviders,
  DEFAULT_IMAGE_HEIGHT,
  DEFAULT_IMAGE_WIDTH,
  browser,
  ProviderFactory,
} from '@atlaskit/editor-common';
import { CardEvent } from '@atlaskit/media-card';
import { findParentNodeOfTypeClosestToPos } from 'prosemirror-utils';
import { NodeSelection } from 'prosemirror-state';
import { MediaClientConfig } from '@atlaskit/media-core';

import { SelectionBasedNodeView } from '../../../nodeviews/ReactNodeView';
import MediaItem from './media';
import WithPluginState from '../../../ui/WithPluginState';
import { pluginKey as widthPluginKey } from '../../width';
import { setNodeSelection } from '../../../utils';
import ResizableMediaSingle from '../ui/ResizableMediaSingle';
import { createDisplayGrid } from '../../../plugins/grid';
import { EventDispatcher } from '../../../event-dispatcher';
import { PortalProviderAPI } from '../../../ui/PortalProvider';
import { MediaOptions, MediaPMPluginOptions } from '../index';
import { stateKey as mediaPluginKey } from '../pm-plugins/main';
import { isMobileUploadCompleted } from '../commands/helpers';
import { MediaSingleNodeProps, MediaSingleNodeViewProps } from './types';
import { MediaNodeUpdater } from './mediaNodeUpdater';
import { getViewMediaClientConfigFromMediaProvider } from '../utils/media-common';
import { DispatchAnalyticsEvent } from '../../analytics';

export interface MediaSingleNodeState {
  width?: number;
  height?: number;
  viewMediaClientConfig?: MediaClientConfig;
}

export default class MediaSingleNode extends Component<
  MediaSingleNodeProps,
  MediaSingleNodeState
> {
  static defaultProps: Partial<MediaSingleNodeProps> = {
    mediaOptions: {},
  };

  state = {
    width: undefined,
    height: undefined,
    viewMediaClientConfig: undefined,
  };

  createMediaNodeUpdater = (props: MediaSingleNodeProps): MediaNodeUpdater => {
    const node = this.props.node.firstChild;

    return new MediaNodeUpdater({
      ...props,
      isMediaSingle: true,
      node: node ? (node as PMNode) : this.props.node,
      dispatchAnalyticsEvent: this.props.dispatchAnalyticsEvent,
    });
  };

  UNSAFE_componentWillReceiveProps(nextProps: MediaSingleNodeProps) {
    if (nextProps.mediaProvider !== this.props.mediaProvider) {
      this.setViewMediaClientConfig(nextProps);
      this.createMediaNodeUpdater(nextProps).updateFileAttrs();
    }
  }

  setViewMediaClientConfig = async (props: MediaSingleNodeProps) => {
    const mediaProvider = await props.mediaProvider;
    if (mediaProvider) {
      const viewMediaClientConfig = await getViewMediaClientConfigFromMediaProvider(
        mediaProvider,
      );

      this.setState({
        viewMediaClientConfig,
      });
    }
  };

  updateMediaNodeAttributes = async (props: MediaSingleNodeProps) => {
    const mediaNodeUpdater = this.createMediaNodeUpdater(props);

    // we want the first child of MediaSingle (type "media")
    const node = this.props.node.firstChild;

    if (!node) {
      return;
    }

    const updatedDimensions = await mediaNodeUpdater.getRemoteDimensions();
    if (updatedDimensions) {
      mediaNodeUpdater.updateDimensions(updatedDimensions);
    }

    if (node.attrs.type === 'external') {
      await mediaNodeUpdater.uploadExternalMedia(this.props.getPos());
      return;
    }

    const contextId = mediaNodeUpdater.getCurrentContextId();
    if (!contextId) {
      await mediaNodeUpdater.updateContextId();
    }

    const isNodeFromDifferentCollection = await mediaNodeUpdater.isNodeFromDifferentCollection();

    if (isNodeFromDifferentCollection) {
      mediaNodeUpdater.copyNode();
    }
  };

  async componentDidMount() {
    await Promise.all([
      this.setViewMediaClientConfig(this.props),
      this.updateMediaNodeAttributes(this.props),
    ]);
  }

  private onExternalImageLoaded = ({
    width,
    height,
  }: {
    width: number;
    height: number;
  }) => {
    this.setState(
      {
        width,
        height,
      },
      () => {
        this.forceUpdate();
      },
    );
  };

  selectMediaSingle = ({ event }: CardEvent) => {
    // We need to call "stopPropagation" here in order to prevent the browser from navigating to
    // another URL if the media node is wrapped in a link mark.
    event.stopPropagation();
    setNodeSelection(this.props.view, this.props.getPos());
  };

  updateSize = (width: number | null, layout: MediaSingleLayout) => {
    const { state, dispatch } = this.props.view;
    const pos = this.props.getPos();
    if (typeof pos === 'undefined') {
      return;
    }
    return dispatch(
      state.tr.setNodeMarkup(pos, undefined, {
        ...this.props.node.attrs,
        layout,
        width,
      }),
    );
  };

  render() {
    const {
      selected,
      getPos,
      node,
      view: { state },
      mediaPluginOptions,
      fullWidthMode,
    } = this.props;

    const { layout, width: mediaSingleWidth } = node.attrs;
    const childNode = node.firstChild!;

    let { width, height, type } = childNode.attrs;

    if (type === 'external') {
      const { width: stateWidth, height: stateHeight } = this.state;

      if (width === null) {
        width = stateWidth || DEFAULT_IMAGE_WIDTH;
      }

      if (height === null) {
        height = stateHeight || DEFAULT_IMAGE_HEIGHT;
      }
    }

    let canResize = !!this.props.mediaOptions.allowResizing;

    const pos = getPos();
    if (pos) {
      const $pos = state.doc.resolve(pos);
      const { table } = state.schema.nodes;
      const disabledNode = !!findParentNodeOfTypeClosestToPos($pos, [table]);
      canResize = canResize && !disabledNode;
    }

    if (width === null || height === null) {
      width = DEFAULT_IMAGE_WIDTH;
      height = DEFAULT_IMAGE_HEIGHT;
    }

    const cardWidth = this.props.width;
    const cardHeight = (height / width) * cardWidth;
    const cardDimensions = {
      width: `${cardWidth}px`,
      height: `${cardHeight}px`,
    };

    const props = {
      layout,
      width,
      height,

      containerWidth: this.props.width,
      lineLength: this.props.lineLength,
      pctWidth: mediaSingleWidth,

      fullWidthMode,
    };

    const uploadComplete = isMobileUploadCompleted(
      this.props.mediaPluginState,
      childNode.attrs.id,
    );

    const MediaChild = (
      <MediaItem
        view={this.props.view}
        node={childNode}
        getPos={this.props.getPos}
        cardDimensions={cardDimensions}
        viewMediaClientConfig={this.state.viewMediaClientConfig}
        selected={selected()}
        onClick={this.selectMediaSingle}
        onExternalImageLoaded={this.onExternalImageLoaded}
        allowLazyLoading={
          mediaPluginOptions && mediaPluginOptions.allowLazyLoading
        }
        uploadComplete={uploadComplete}
        url={childNode.attrs.url}
      />
    );

    return canResize ? (
      <ResizableMediaSingle
        {...props}
        view={this.props.view}
        getPos={getPos}
        updateSize={this.updateSize}
        displayGrid={createDisplayGrid(this.props.eventDispatcher)}
        gridSize={12}
        viewMediaClientConfig={this.state.viewMediaClientConfig}
        state={this.props.view.state}
        allowBreakoutSnapPoints={
          mediaPluginOptions && mediaPluginOptions.allowBreakoutSnapPoints
        }
        selected={this.props.selected()}
      >
        {MediaChild}
      </ResizableMediaSingle>
    ) : (
      <MediaSingle {...props}>{MediaChild}</MediaSingle>
    );
  }
}

class MediaSingleNodeView extends SelectionBasedNodeView<
  MediaSingleNodeViewProps
> {
  lastOffsetLeft = 0;
  forceViewUpdate = false;

  createDomRef(): HTMLElement {
    const domRef = document.createElement('div');
    if (
      browser.chrome &&
      this.reactComponentProps.mediaPluginOptions &&
      this.reactComponentProps.mediaPluginOptions.allowMediaSingleEditable
    ) {
      // workaround Chrome bug in https://product-fabric.atlassian.net/browse/ED-5379
      // see also: https://github.com/ProseMirror/prosemirror/issues/884
      domRef.contentEditable = 'true';
    }
    return domRef;
  }

  viewShouldUpdate(nextNode: PMNode) {
    if (this.forceViewUpdate) {
      this.forceViewUpdate = false;
      return true;
    }

    if (this.node.attrs !== nextNode.attrs) {
      return true;
    }

    return super.viewShouldUpdate(nextNode);
  }

  getNodeMediaId(node: PMNode): string | undefined {
    if (node.firstChild) {
      return node.firstChild.attrs.id;
    }
    return undefined;
  }

  update(
    node: PMNode,
    decorations: Decoration[],
    isValidUpdate?: (currentNode: PMNode, newNode: PMNode) => boolean,
  ) {
    if (!isValidUpdate) {
      isValidUpdate = (currentNode, newNode) =>
        this.getNodeMediaId(currentNode) === this.getNodeMediaId(newNode);
    }
    return super.update(node, decorations, isValidUpdate);
  }

  render() {
    const {
      eventDispatcher,
      fullWidthMode,
      providerFactory,
      mediaOptions,
      mediaPluginOptions,
      dispatchAnalyticsEvent,
    } = this.reactComponentProps;

    return (
      <WithProviders
        providers={['mediaProvider', 'contextIdentifierProvider']}
        providerFactory={providerFactory}
        renderNode={({ mediaProvider, contextIdentifierProvider }) => {
          return (
            <WithPluginState
              editorView={this.view}
              plugins={{
                width: widthPluginKey,
                mediaPluginState: mediaPluginKey,
              }}
              render={({ width, mediaPluginState }) => {
                const { selection } = this.view.state;
                const isSelected = () =>
                  this.isSelectionInsideNode(selection.from, selection.to) ||
                  (selection instanceof NodeSelection &&
                    selection.from === this.getPos());

                return (
                  <MediaSingleNode
                    width={width.width}
                    lineLength={width.lineLength}
                    node={this.node}
                    getPos={this.getPos}
                    mediaProvider={mediaProvider}
                    contextIdentifierProvider={contextIdentifierProvider}
                    mediaOptions={mediaOptions || {}}
                    view={this.view}
                    fullWidthMode={fullWidthMode}
                    selected={isSelected}
                    eventDispatcher={eventDispatcher}
                    mediaPluginOptions={mediaPluginOptions}
                    mediaPluginState={mediaPluginState}
                    dispatchAnalyticsEvent={dispatchAnalyticsEvent}
                  />
                );
              }}
            />
          );
        }}
      />
    );
  }

  ignoreMutation() {
    // DOM has changed; recalculate if we need to re-render
    if (this.dom) {
      const offsetLeft = this.dom.offsetLeft;

      if (offsetLeft !== this.lastOffsetLeft) {
        this.lastOffsetLeft = offsetLeft;
        this.forceViewUpdate = true;

        this.update(this.node, [], () => true);
      }
    }

    return true;
  }
}

export const ReactMediaSingleNode = (
  portalProviderAPI: PortalProviderAPI,
  eventDispatcher: EventDispatcher,
  providerFactory: ProviderFactory,
  mediaOptions: MediaOptions = {},
  pluginOptions?: MediaPMPluginOptions,
  fullWidthMode?: boolean,
  dispatchAnalyticsEvent?: DispatchAnalyticsEvent,
) => (node: PMNode, view: EditorView, getPos: () => number) => {
  return new MediaSingleNodeView(node, view, getPos, portalProviderAPI, {
    eventDispatcher,
    mediaPluginOptions: pluginOptions,
    fullWidthMode,
    providerFactory,
    mediaOptions,
    dispatchAnalyticsEvent,
  }).init();
};
