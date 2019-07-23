import { Transaction, Plugin, PluginKey, EditorState } from 'prosemirror-state';
import { Dispatch } from '../../../event-dispatcher';
import { pluginFactory } from '../../../utils/plugin-state-factory';
import reducer from './reducer';
import { HistoryAnalyticsAction, HistoryAnalyticsActionTypes } from './actions';
import { pmHistoryPluginKey } from './prosemirror-history-types';

export const historyAnalyticsPluginKey = new PluginKey('historyAnalytics');
export const invertedStepsMetaKey = 'invertedSteps';

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
      const transactionsToPush = transactions.filter(
        tr =>
          !tr.getMeta(historyAnalyticsPluginKey) &&
          !tr.getMeta(pmHistoryPluginKey) &&
          tr.steps.length > 0,
      );
      if (transactionsToPush.length > 0) {
        const action: HistoryAnalyticsAction = {
          type: HistoryAnalyticsActionTypes.PUSH,
          transactions: transactionsToPush,
          oldState,
          state: newState,
        };
        return newState.tr.setMeta(historyAnalyticsPluginKey, action);
      }

      if (transactions.find(tr => tr.getMeta(pmHistoryPluginKey))) {
        const action: HistoryAnalyticsAction = {
          type: HistoryAnalyticsActionTypes.SYNC,
          state: newState,
        };
        return newState.tr.setMeta(historyAnalyticsPluginKey, action);
      }

      return;
    },
  });

export { createPluginState, createCommand, getPluginState };
