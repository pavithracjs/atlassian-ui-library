import { Transaction, Plugin, PluginKey, EditorState } from 'prosemirror-state';
import { Dispatch } from '../../../event-dispatcher';
import { pluginFactory } from '../../../utils/plugin-state-factory';
import reducer from './reducer';
import { HistoryAnalyticsAction, HistoryAnalyticsActionTypes } from './actions';

export const historyAnalyticsPluginKey = new PluginKey('historyAnalytics');

export interface HistoryAnalyticsPluginState {
  done: Transaction[];
  undone: Transaction[];
}

const getInitialState = (): HistoryAnalyticsPluginState => ({
  done: [],
  undone: [],
});

const historyAnalyticsPluginFactory = pluginFactory<
  HistoryAnalyticsPluginState,
  HistoryAnalyticsAction,
  HistoryAnalyticsPluginState
>(historyAnalyticsPluginKey, reducer);

const {
  createPluginState,
  createCommand,
  getPluginState,
} = historyAnalyticsPluginFactory;

export const createPlugin = (dispatch: Dispatch) =>
  new Plugin({
    key: historyAnalyticsPluginKey,
    state: createPluginState(dispatch, getInitialState()),
    appendTransaction: (
      transactions: Transaction[],
      oldState: EditorState,
      newState: EditorState,
    ) => {
      const meta = transactions.find(tr =>
        tr.getMeta(historyAnalyticsPluginKey),
      );
      if (!meta) {
        const action: HistoryAnalyticsAction = {
          type: HistoryAnalyticsActionTypes.PUSH,
          transactions,
          oldState,
          state: newState,
        };
        return newState.tr.setMeta(historyAnalyticsPluginKey, action);
      }
      return;
    },
  });

export { createPluginState, createCommand, getPluginState };
