import { EditorState, StateField, PluginKey } from 'prosemirror-state';
import { Command } from '../../types';
import { Dispatch } from '../../event-dispatcher';

export type Reducer<S, A> = (state: S, action: A) => S;

export function pluginStateFactory<S, A, IS extends S>(
  pluginKey: PluginKey,
  initialState: IS,
  reducer: Reducer<S, A>,
): {
  createState: (dispatch: Dispatch) => StateField<S>;
  createCommand: (action: A) => Command;
  getPluginState: (editorState: EditorState) => S;
} {
  return {
    createState: dispatch => ({
      init: () => initialState,
      apply(tr, pluginState) {
        const meta = tr.getMeta(pluginKey);
        if (meta) {
          const newState = reducer(pluginState, meta);
          dispatch(pluginKey, newState);
          return newState;
        }
        return pluginState;
      },
    }),
    createCommand: (action): Command => (state, dispatch) => {
      dispatch(state.tr.setMeta(pluginKey, action));
      return true;
    },
    getPluginState: editorState => pluginKey.getState(editorState),
  };
}
