import { HistoryAnalyticsAction, HistoryAnalyticsActionTypes } from './actions';
import { HistoryAnalyticsPluginState } from './main';
import {
  pushTransactionsToHistory,
  syncWithPmHistory,
  getPmHistoryPluginState,
} from './utils';

export default (
  pluginState: HistoryAnalyticsPluginState,
  action: HistoryAnalyticsAction,
) => {
  let newState = pluginState;

  switch (action.type) {
    case HistoryAnalyticsActionTypes.PUSH:
      newState = syncWithPmHistory(
        pushTransactionsToHistory(
          action.transactions,
          pluginState,
          action.oldState,
        ),
        getPmHistoryPluginState(action.state),
        action.state,
      );
      break;

    case HistoryAnalyticsActionTypes.UNDO:
      newState = {
        done: pluginState.done.slice(0, -action.transactions.length),
        undone: [...pluginState.undone, ...action.transactions],
      };
      break;

    case HistoryAnalyticsActionTypes.REDO:
      newState = {
        done: [...pluginState.done, ...action.transactions],
        undone: pluginState.undone.slice(0, -action.transactions.length),
      };
      break;

    case HistoryAnalyticsActionTypes.SYNC:
      newState = syncWithPmHistory(
        pluginState,
        getPmHistoryPluginState(action.state),
        action.state,
      );
      break;
  }

  return newState;
};
