import { Transaction, Plugin, PluginKey, EditorState } from 'prosemirror-state';
import { Dispatch } from '../../../event-dispatcher';
import { pluginFactory } from '../../../utils/plugin-state-factory';
import reducer from './reducer';
import { HistoryAnalyticsAction, HistoryAnalyticsActionTypes } from './actions';
import { pmHistoryPluginKey } from './types';
import { pluginKey as typeaheadPluginKey } from '../../type-ahead/pm-plugins/main';

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
      const allowedTransactions = transactions.filter(
        tr =>
          !tr.getMeta(historyAnalyticsPluginKey) &&
          !tr.getMeta(pmHistoryPluginKey) &&
          tr.steps.length > 0,
      );
      if (allowedTransactions.length > 0) {
        const action: HistoryAnalyticsAction = {
          type: HistoryAnalyticsActionTypes.PUSH,
          transactions: allowedTransactions,
          oldState,
          state: newState,
        };
        return newState.tr.setMeta(historyAnalyticsPluginKey, action);
      }
      return;
    },
  });

export { createPluginState, createCommand, getPluginState };
