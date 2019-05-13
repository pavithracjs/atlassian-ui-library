import { stateKey as mediaPluginKey } from '../pm-plugins/main';
import { Command } from '../../../types';
import { Node } from 'prosemirror-model';

export interface Action<A> {
  type: A;
}

export interface ActionWithPayload<A, P> extends Action<A> {
  payload: P;
}

export type SetMediaGroupItem = {
  id: string;
  node: Node;
  getPos: () => number;
};

export type SetMediaGroupItemsPayload = Array<SetMediaGroupItem>;

type SetMediaGroupItemsAction = ActionWithPayload<
  'SET_MEDIA_GROUP_ITEMS',
  SetMediaGroupItemsPayload
>;

export type MediaActions = SetMediaGroupItemsAction;

export const setMediaGroupItems = (
  items: SetMediaGroupItemsPayload,
): Command => (state, dispatch) => {
  if (dispatch) {
    const mediaAction: SetMediaGroupItemsAction = {
      type: 'SET_MEDIA_GROUP_ITEMS',
      payload: items,
    };
    dispatch(state.tr.setMeta(mediaPluginKey, mediaAction));
  }
  return true;
};
