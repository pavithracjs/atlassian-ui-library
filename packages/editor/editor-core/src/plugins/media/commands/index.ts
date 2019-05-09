import { Command } from '../../../types';
import {
  stateKey as mediaPluginKey,
  MediaPluginState,
  MediaState,
} from '../pm-plugins/main';
import { findMediaNode, selectedMediaContainerNode } from './helpers';
import {
  SetAttrsStep,
  isTemporary,
  atTheBeginningOfDoc,
  moveLeft,
} from '../../../utils';
import { Node } from 'prosemirror-model';
import { ProsemirrorGetPosHandler } from '../../../nodeviews';
import { isImage } from '../../../utils';

export const updateMediaNodeAttrs = (
  id: string,
  attrs: object,
  isMediaSingle: boolean,
): Command => (state, dispatch) => {
  const mediaPluginState: MediaPluginState = mediaPluginKey.getState(state);

  const mediaNodeWithPos = findMediaNode(mediaPluginState, id, isMediaSingle);

  if (!mediaNodeWithPos) {
    return false;
  }

  if (dispatch) {
    dispatch(
      state.tr
        .step(new SetAttrsStep(mediaNodeWithPos.getPos(), attrs))
        .setMeta('addToHistory', false),
    );
  }
  return true;
};

export const removeMediaNode = (
  node: Node,
  getPos: ProsemirrorGetPosHandler,
): Command => (state, dispatch?, view?) => {
  const { id } = node.attrs;
  const { tr, selection, doc } = state;

  const currentMediaNodePos = getPos();
  tr.deleteRange(currentMediaNodePos, currentMediaNodePos + node.nodeSize);

  if (isTemporary(id)) {
    tr.setMeta('addToHistory', false);
  }

  if (dispatch) {
    dispatch(tr);

    const $currentMediaNodePos = doc.resolve(currentMediaNodePos);
    const isLastMediaNode =
      $currentMediaNodePos.index() ===
      $currentMediaNodePos.parent.childCount - 1;

    // If deleting a selected media node, we need to tell where the cursor to go next.
    // Prosemirror didn't gave us the behaviour of moving left if the media node is not the last one.
    // So we handle it ourselves.
    if (
      selection.from === currentMediaNodePos &&
      !isLastMediaNode &&
      !atTheBeginningOfDoc(state)
    ) {
      if (view) {
        moveLeft(view);
      }
    }
  }

  return true;
};

export const removeMediaNodeInPos = (getPos: () => number): Command => (
  state,
  dispatch,
  view,
) => {
  const node = state.doc.nodeAt(getPos()) as Node;

  return removeMediaNode(node, getPos)(state, dispatch, view);
};

export const removeNodeById = (mediaState: MediaState): Command => (
  state,
  dispatch,
  view,
) => {
  const mediaPluginState: MediaPluginState = mediaPluginKey.getState(state);

  const mediaNodeWithPos = findMediaNode(
    mediaPluginState,
    mediaState.id,
    isImage(mediaState.fileMimeType),
  );

  if (mediaNodeWithPos) {
    return removeMediaNode(mediaNodeWithPos.node, mediaNodeWithPos.getPos)(
      state,
      dispatch,
      view,
    );
  }
  return false;
};

export const removeSelectedMediaContainer = (): Command => (
  state,
  dispatch,
  view,
) => {
  const selectedNode = selectedMediaContainerNode(state);
  if (!selectedNode) {
    return false;
  }

  let { from } = state.selection;

  return removeMediaNode(selectedNode.firstChild!, () => from + 1)(
    state,
    dispatch,
    view,
  );
};
