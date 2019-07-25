import * as React from 'react';
import { Node as PMNode } from 'prosemirror-model';
import { EditorView, NodeView } from 'prosemirror-view';
import ReactNodeView, { ForwardRef } from '../../../nodeviews/ReactNodeView';
import { PortalProviderAPI } from '../../../ui/PortalProvider';
import { Filmstrip } from '@atlaskit/media-filmstrip';
import {
  MediaPluginState,
  stateKey as mediaStateKey,
} from '../pm-plugins/main';
import { FileIdentifier } from '@atlaskit/media-client';
import { MediaClientConfig } from '@atlaskit/media-core';
import { setNodeSelection } from '../../../utils';
import WithPluginState from '../../../ui/WithPluginState';
import { stateKey as reactNodeViewStateKey } from '../../../plugins/base/pm-plugins/react-nodeview';
import EditorCloseIcon from '@atlaskit/icon/glyph/editor/close';
import {
  pluginKey as editorDisabledPluginKey,
  EditorDisabledPluginState,
} from '../../editor-disabled';
import { EditorAppearance } from '../../../types';
import {
  WithProviders,
  ProviderFactory,
  ContextIdentifierProvider,
} from '@atlaskit/editor-common';
import { MediaProvider } from '../types';

export type MediaGroupProps = {
  forwardRef?: (ref: HTMLElement) => void;
  node: PMNode;
  view: EditorView;
  getPos: () => number;
  selected: number | null;
  disabled?: boolean;
  editorAppearance: EditorAppearance;
  mediaProvider: Promise<MediaProvider>;
  contextIdentifierProvider: Promise<ContextIdentifierProvider>;
};

export interface MediaGroupState {
  viewMediaClientConfig?: MediaClientConfig;
}

export default class MediaGroup extends React.Component<
  MediaGroupProps,
  MediaGroupState
> {
  private mediaPluginState: MediaPluginState;
  private mediaNodes: PMNode[];

  state: MediaGroupState = {
    viewMediaClientConfig: undefined,
  };

  constructor(props: MediaGroupProps) {
    super(props);
    this.mediaNodes = [];
    this.mediaPluginState = mediaStateKey.getState(props.view.state);
    this.setMediaItems(props);
  }

  async componentDidMount() {
    this.updateMediaClientConfig();

    // TODO: no need for constructor, iterate all nodes and create one for each here
    // const contextId = this.mediaNodeUpdater.getCurrentContextId();
    // if (!contextId) {
    //   await this.mediaNodeUpdater.updateContextId();
    // }

    this.mediaNodes.forEach(n => console.log(n));
  }

  componentWillReceiveProps(props: MediaGroupProps) {
    this.updateMediaClientConfig();
    this.setMediaItems(props);
  }

  shouldComponentUpdate(nextProps: MediaGroupProps) {
    if (
      this.props.selected !== nextProps.selected ||
      this.props.node !== nextProps.node ||
      this.state.viewMediaClientConfig !==
        this.mediaPluginState.mediaClientConfig
    ) {
      return true;
    }

    return false;
  }

  updateMediaClientConfig() {
    const { viewMediaClientConfig } = this.state;
    const { mediaClientConfig } = this.mediaPluginState;
    if (!viewMediaClientConfig && mediaClientConfig) {
      this.setState({
        viewMediaClientConfig: mediaClientConfig,
      });
    }
  }

  setMediaItems = (props: MediaGroupProps) => {
    const { node } = props;
    this.mediaNodes = [] as Array<PMNode>;
    node.forEach((item, childOffset) => {
      this.mediaPluginState.mediaGroupNodes[item.attrs.id] = {
        node: item,
        getPos: () => props.getPos() + childOffset + 1,
      };
      this.mediaNodes.push(item);
    });
  };

  renderChildNodes = () => {
    const { viewMediaClientConfig } = this.state;
    const items = this.mediaNodes.map((item, idx) => {
      const identifier: FileIdentifier = {
        id: item.attrs.id,
        mediaItemType: 'file',
        collectionName: item.attrs.collection,
      };

      const nodePos = this.props.getPos() + idx + 1;
      return {
        identifier,
        selectable: true,
        isLazy: this.props.editorAppearance !== 'mobile',
        selected: this.props.selected === nodePos,
        onClick: () => {
          setNodeSelection(this.props.view, nodePos);
        },
        actions: [
          {
            handler: this.props.disabled
              ? {}
              : this.mediaPluginState.handleMediaNodeRemoval.bind(
                  null,
                  null,
                  () => nodePos,
                ),
            icon: <EditorCloseIcon label="delete" />,
          },
        ],
      };
    });

    return (
      <Filmstrip items={items} mediaClientConfig={viewMediaClientConfig} />
    );
  };

  render() {
    return this.renderChildNodes();
  }
}

class MediaGroupNodeView extends ReactNodeView {
  render(_props: any, forwardRef: ForwardRef) {
    // TODO: improve React component prop types
    const { editorAppearance, providerFactory } = this.reactComponentProps;
    return (
      <WithProviders
        providers={['mediaProvider', 'contextIdentifierProvider']}
        providerFactory={providerFactory}
        renderNode={({ mediaProvider, contextIdentifierProvider }) => {
          return (
            <WithPluginState
              editorView={this.view}
              plugins={{
                reactNodeViewState: reactNodeViewStateKey,
                editorDisabledPlugin: editorDisabledPluginKey,
              }}
              render={({
                editorDisabledPlugin,
              }: {
                editorDisabledPlugin: EditorDisabledPluginState;
              }) => {
                const nodePos = this.getPos();
                const { $anchor, $head } = this.view.state.selection;
                const isSelected =
                  nodePos < $anchor.pos &&
                  $head.pos < nodePos + this.node.nodeSize;
                return (
                  <MediaGroup
                    node={this.node}
                    getPos={this.getPos}
                    view={this.view}
                    forwardRef={forwardRef}
                    selected={isSelected ? $anchor.pos : null}
                    disabled={(editorDisabledPlugin || {}).editorDisabled}
                    editorAppearance={editorAppearance}
                    mediaProvider={mediaProvider}
                    contextIdentifierProvider={contextIdentifierProvider}
                  />
                );
              }}
            />
          );
        }}
      />
    );
  }
}

export const ReactMediaGroupNode = (
  portalProviderAPI: PortalProviderAPI,
  providerFactory: ProviderFactory,
  editorAppearance?: EditorAppearance,
) => (node: PMNode, view: EditorView, getPos: () => number): NodeView => {
  return new MediaGroupNodeView(node, view, getPos, portalProviderAPI, {
    editorAppearance,
    providerFactory,
  }).init();
};
