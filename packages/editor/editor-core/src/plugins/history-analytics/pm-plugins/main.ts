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

const { createPluginState } = historyAnalyticsPluginFactory;

export const createPlugin = (dispatch: Dispatch) =>
  new Plugin({
    key: historyAnalyticsPluginKey,
    state: createPluginState(dispatch, getInitialState()),
    appendTransaction: (
      transactions: Transaction[],
      oldState: EditorState,
      newState: EditorState,
    ) => {
      return newState.tr.setMeta(historyAnalyticsPluginKey, {
        type: HistoryAnalyticsActionTypes.PUSH,
        tr: newState.tr,
      });
    },
  });
