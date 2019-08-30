import { Command } from '../../../types';
import {
  stateKey as mediaPluginKey,
  MediaPluginState,
} from '../pm-plugins/main';
import { findMediaNode } from './helpers';
import { SetAttrsStep } from '../../../utils';

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

export const replaceExternalMedia = (pos: number, attrs: object): Command => (
  state,
  dispatch,
) => {
  if (dispatch) {
    dispatch(
      state.tr
        .step(
          new SetAttrsStep(pos, {
            type: 'file',
            url: null,
            ...attrs,
          }),
        )
        .setMeta('addToHistory', false),
    );
    return true;
  }
  return false;
};
