import * as React from 'react';
import { Node as PMNode, Node } from 'prosemirror-model';
import { EditorView, NodeView } from 'prosemirror-view';
import {
  ForwardRef,
  SelectionBasedNodeView,
} from '../../../nodeviews/ReactNodeView';
import { PortalProviderAPI } from '../../../ui/PortalProvider';
import { Filmstrip, FilmstripItem } from '@atlaskit/media-filmstrip';
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
import {
  setMediaGroupItems,
  SetMediaGroupItemsPayload,
} from '../commands/actions';

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

function getMediaIds(mediaGroupNode: Node) {
  const mediaNodesId: Array<string> = [];
  mediaGroupNode.forEach(item => {
    mediaNodesId.push(item.attrs.id);
  });

  return mediaNodesId;
}

function hasSameMediaItems(
  mediaIds: Array<string>,
  newMediaGroupNode: PMNode,
): Boolean {
  if (mediaIds.length !== newMediaGroupNode.childCount) {
    return false;
  }

  // Check if all the items are in both arrays
  const newMediaNodesId: Array<string> = [];
  newMediaGroupNode.forEach(item => {
    newMediaNodesId.push(item.attrs.id);
  });

  return newMediaNodesId.every(
    mediaNodeId => mediaIds.indexOf(mediaNodeId) !== -1,
  );
}

export default class MediaGroup extends React.Component<MediaGroupProps> {
  componentDidMount() {
    this.updateMediaGroupItems(this.props);
  }

  componentDidUpdate() {
    this.updateMediaGroupItems(this.props);
  }

  shouldComponentUpdate(nextProps: MediaGroupProps) {
    if (
      this.props.selected !== nextProps.selected ||
      !hasSameMediaItems(getMediaIds(this.props.node), nextProps.node) ||
      this.props.mediaContext !== nextProps.mediaContext
    ) {
      return true;
    }

    return false;
  }

  updateMediaGroupItems = (props: MediaGroupProps) => {
    const { node } = props;

    // We need to move this logic inside media plugin state, maybe dispatching the group nodes in the meta.
    // I dont now if this cause unnecesary renders.
    const items: SetMediaGroupItemsPayload = [];
    node.forEach((item, childOffset) => {
      items.push({
        id: item.attrs.id,
        node: item,
        getPos: () => props.getPos() + childOffset + 1,
      });
    });

    setMediaGroupItems(items)(
      this.props.view.state,
      this.props.view.dispatch,
      this.props.view,
    );
  };

  getFilmstripItems(): Array<FilmstripItem> {
    const filmstripItems: Array<FilmstripItem> = [];

    this.props.node.forEach((mediaNode, mediaOffset) => {
      const identifier: FileIdentifier = {
        id: mediaNode.attrs.id,
        mediaItemType: 'file',
        collectionName: mediaNode.attrs.collection,
      };

      const nodePos = this.props.getPos() + mediaOffset + 1;
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

      filmstripItems.push({
        identifier,
        selectable: true,
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
      });
    });

    return filmstripItems;
  }

  render() {
    const { mediaContext } = this.props;

    // Is good to do this here, because should component update is preventing unnecessary calls
    const items = this.getFilmstripItems();
    return <Filmstrip items={items} context={mediaContext} />;
  }
}

const MediaGroupWithContext = withMediaContext<MediaGroupProps>(MediaGroup);
class MediaGroupNodeView extends SelectionBasedNodeView {
  private mediaItemsId: Array<string> = [];

  viewShouldUpdate(node: PMNode) {
    // Update if new media id items
    if (!hasSameMediaItems(this.mediaItemsId, node)) {
      this.mediaItemsId = getMediaIds(node);
      return true;
    }

    return super.viewShouldUpdate(node);
  }

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
