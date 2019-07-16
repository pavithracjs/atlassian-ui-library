import { HistoryAnalyticsAction, HistoryAnalyticsActionTypes } from './actions';
import { HistoryAnalyticsPluginState } from './main';
import { pushTransactionsToHistory, syncWithPmHistory } from './utils';

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
        action.state,
      );
      break;

    case HistoryAnalyticsActionTypes.UNDO:
      // cannot sync with prosemirror-history here as this plugin has a higher rank so
      // it will always be out of sync at this point
      newState = {
        done: pluginState.done.slice(0, -action.transactions.length),
        undone: [...pluginState.undone, ...action.transactions],
      };
      break;

    // todo: analytics for redo
    case HistoryAnalyticsActionTypes.REDO:
      break;
  }

  if (newState !== pluginState) {
    console.log('new state:', newState);
  }
  return newState;
};
