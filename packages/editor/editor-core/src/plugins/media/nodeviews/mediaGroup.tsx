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
import { Context, FileIdentifier } from '@atlaskit/media-core';
import { setNodeSelection } from '../../../utils';
import WithPluginState from '../../../ui/WithPluginState';
import { stateKey as reactNodeViewStateKey } from '../../../plugins/base/pm-plugins/react-nodeview';
import EditorCloseIcon from '@atlaskit/icon/glyph/editor/close';
import {
  pluginKey as editorDisabledPluginKey,
  EditorDisabledPluginState,
} from '../../editor-disabled';
import { EditorAppearance } from '../../../types';
import { removeMediaNodeInPos } from '../commands/media';
import { WithProviders, ProviderFactory } from '../../../../../editor-common';
import withMediaContext from '../utils/withMediaContext';

export interface Props {
  children?: React.ReactNode;
  view: EditorView;
  node: PMNode;
}

export type MediaGroupProps = {
  forwardRef?: (ref: HTMLElement) => void;
  node: PMNode;
  view: EditorView;
  getPos: () => number;
  selected: number | null;
  disabled?: boolean;
  editorAppearance: EditorAppearance;
  mediaContext?: Context;
};

export default class MediaGroup extends React.Component<MediaGroupProps> {
  private mediaPluginState: MediaPluginState;
  private mediaNodes: PMNode[];

  constructor(props: MediaGroupProps) {
    super(props);
    this.mediaNodes = [];
    this.mediaPluginState = mediaStateKey.getState(props.view.state);
    this.setMediaItems(props);
  }

  componentWillReceiveProps(props: MediaGroupProps) {
    this.setMediaItems(props);
  }

  shouldComponentUpdate(nextProps: MediaGroupProps) {
    if (
      this.props.selected !== nextProps.selected ||
      this.props.node !== nextProps.node ||
      this.props.mediaContext !== nextProps.mediaContext
    ) {
      return true;
    }

    return false;
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
    const { mediaContext } = this.props;
    const items = this.mediaNodes.map((item, idx) => {
      const identifier: FileIdentifier = {
        id: item.attrs.id,
        mediaItemType: 'file',
        collectionName: item.attrs.collection,
      };

      const nodePos = this.props.getPos() + idx + 1;
      const deleteHandler = () => {
        if (this.props.disabled) {
          return;
        }
        removeMediaNodeInPos(() => nodePos)(
          this.props.view.state,
          this.props.view.dispatch,
          this.props.view,
        );
      };
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
            handler: deleteHandler,
            icon: <EditorCloseIcon label="delete" />,
          },
        ],
      };
    });

    return <Filmstrip items={items} context={mediaContext} />;
  };

  render() {
    return this.renderChildNodes();
  }
}

const MediaGroupWithContext = withMediaContext<MediaGroupProps>(MediaGroup);
class MediaGroupNodeView extends ReactNodeView {
  render(_props: any, forwardRef: ForwardRef) {
    const { editorAppearance, providerFactory } = this.reactComponentProps;
    return (
      <WithProviders
        providers={['mediaProvider']}
        providerFactory={providerFactory}
        renderNode={({ mediaProvider }) => (
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
                <MediaGroupWithContext
                  node={this.node}
                  getPos={this.getPos}
                  view={this.view}
                  forwardRef={forwardRef}
                  selected={isSelected ? $anchor.pos : null}
                  disabled={(editorDisabledPlugin || {}).editorDisabled}
                  editorAppearance={editorAppearance}
                  mediaProvider={mediaProvider}
                />
              );
            }}
          />
        )}
      />
    );
  }

  stopEvent(event: Event) {
    event.preventDefault();
    return true;
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
