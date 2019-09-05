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
import { MediaNodeUpdater } from './mediaNodeUpdater';

export type MediaGroupProps = {
  forwardRef?: (ref: HTMLElement) => void;
  node: PMNode;
  view: EditorView;
  getPos: () => number;
  selected: number | null;
  disabled?: boolean;
  allowLazyLoading?: boolean;
  editorAppearance: EditorAppearance;
  mediaProvider: Promise<MediaProvider>;
  contextIdentifierProvider?: Promise<ContextIdentifierProvider>;
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

  componentDidMount() {
    this.updateMediaClientConfig();

    this.mediaNodes.forEach(async (node: PMNode) => {
      if (node.attrs.type === 'external') {
        return;
      }

      const { view, mediaProvider, contextIdentifierProvider } = this.props;
      const mediaNodeUpdater = new MediaNodeUpdater({
        view,
        mediaProvider,
        contextIdentifierProvider,
        node,
        isMediaSingle: false,
      });

      const contextId = mediaNodeUpdater.getCurrentContextId();
      if (!contextId) {
        await mediaNodeUpdater.updateContextId();
      }

      const isNodeFromDifferentCollection = await mediaNodeUpdater.isNodeFromDifferentCollection();

      if (isNodeFromDifferentCollection) {
        mediaNodeUpdater.copyNode();
      }
    });
  }

  UNSAFE_componentWillReceiveProps(props: MediaGroupProps) {
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
        isLazy: this.props.allowLazyLoading,
        selected: this.props.selected === nodePos,
        onClick: () => {
          setNodeSelection(this.props.view, nodePos);
        },
        actions: [
          {
            handler: this.props.disabled
              ? () => {}
              : this.mediaPluginState.handleMediaNodeRemoval.bind(
                  null,
                  undefined,
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

interface MediaGroupNodeViewProps {
  allowLazyLoading?: boolean;
  editorAppearance: EditorAppearance;
  providerFactory: ProviderFactory;
}

class MediaGroupNodeView extends ReactNodeView<MediaGroupNodeViewProps> {
  render(props: MediaGroupNodeViewProps, forwardRef: ForwardRef) {
    const { allowLazyLoading, editorAppearance, providerFactory } = props;
    return (
      <WithProviders
        providers={['mediaProvider', 'contextIdentifierProvider']}
        providerFactory={providerFactory}
        renderNode={({ mediaProvider, contextIdentifierProvider }) => {
          const renderFn = ({
            editorDisabledPlugin,
          }: {
            editorDisabledPlugin: EditorDisabledPluginState;
          }) => {
            const nodePos = this.getPos();
            const { $anchor, $head } = this.view.state.selection;
            const isSelected =
              nodePos < $anchor.pos && $head.pos < nodePos + this.node.nodeSize;
            return (
              <MediaGroup
                node={this.node}
                getPos={this.getPos}
                view={this.view}
                forwardRef={forwardRef}
                selected={isSelected ? $anchor.pos : null}
                disabled={(editorDisabledPlugin || {}).editorDisabled}
                allowLazyLoading={allowLazyLoading}
                editorAppearance={editorAppearance}
                mediaProvider={mediaProvider}
                contextIdentifierProvider={contextIdentifierProvider}
              />
            );
          };
          return (
            <WithPluginState
              editorView={this.view}
              plugins={{
                reactNodeViewState: reactNodeViewStateKey,
                editorDisabledPlugin: editorDisabledPluginKey,
              }}
              render={renderFn}
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
  allowLazyLoading?: boolean,
  editorAppearance?: any,
) => (node: PMNode, view: EditorView, getPos: () => number): NodeView => {
  return new MediaGroupNodeView(node, view, getPos, portalProviderAPI, {
    allowLazyLoading,
    providerFactory,
    editorAppearance,
  }).init();
};
