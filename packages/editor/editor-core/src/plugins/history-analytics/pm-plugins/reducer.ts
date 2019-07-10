import { HistoryPluginState } from './index';
import { HistoryAnalyticsAction, HistoryAnalyticsActionTypes } from './actions';

export default (state: HistoryPluginState, action: HistoryAnalyticsAction) => {
  switch (action.type) {
    case HistoryAnalyticsActionTypes.PUSH:
      return {
        ...state,
        done: [...state.done, action.tr],
      };
    case HistoryAnalyticsActionTypes.UNDO:
    case HistoryAnalyticsActionTypes.REDO:
      // todo: undo/redo
      return state;
  }
};
