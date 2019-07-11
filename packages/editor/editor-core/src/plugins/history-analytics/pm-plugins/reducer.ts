import { HistoryAnalyticsAction, HistoryAnalyticsActionTypes } from './actions';
import { HistoryAnalyticsPluginState } from './main';

export default (
  state: HistoryAnalyticsPluginState,
  action: HistoryAnalyticsAction,
) => {
  switch (action.type) {
    case HistoryAnalyticsActionTypes.PUSH:
      // todo: do i want to keep the separation between arrays of trs?
      // todo: ignore own appended tr, and all appended tr?
      const s = {
        ...state,
        done: [...state.done, ...action.transactions],
      };
      return s;
    case HistoryAnalyticsActionTypes.UNDO:
    case HistoryAnalyticsActionTypes.REDO:
      // todo: undo/redo
      return state;
  }
};
