import { MediaPluginState, MediaNodeWithPosHandler } from '../pm-plugins/main';
import { EditorState, NodeSelection } from 'prosemirror-state';
import { Node } from 'prosemirror-model';

export const findMediaSingleNode = (
  mediaPluginState: MediaPluginState,
  id: string,
) => {
  const { mediaNodes } = mediaPluginState;

  // Array#find... no IE support
  return mediaNodes.reduce(
    (
      memo: MediaNodeWithPosHandler | null,
      nodeWithPos: MediaNodeWithPosHandler,
    ) => {
      if (memo) {
        return memo;
      }

      const { node } = nodeWithPos;
      if (node.attrs.id === id) {
        return nodeWithPos;
      }

      return memo;
    },
    null,
  );
};

export const findMediaNode = (
  mediaPluginState: MediaPluginState,
  id: string,
  isMediaSingle: boolean,
) => {
  const mediaNodeWithPos = isMediaSingle
    ? findMediaSingleNode(mediaPluginState, id)
    : mediaPluginState.mediaGroupNodes[id];
  return mediaNodeWithPos;
};

export const selectedMediaContainerNode = (
  editorState: EditorState,
): Node | undefined => {
  const { selection, schema } = editorState;
  if (
    selection instanceof NodeSelection &&
    (selection.node.type === schema.nodes.mediaSingle ||
      selection.node.type === schema.nodes.mediaGroup)
  ) {
    return selection.node;
  }
};
