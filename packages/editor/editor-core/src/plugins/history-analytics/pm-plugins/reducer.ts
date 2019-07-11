import { history, HistoryState } from 'prosemirror-history';
import { Transaction } from 'prosemirror-state';
import { HistoryAnalyticsAction, HistoryAnalyticsActionTypes } from './actions';
import { HistoryAnalyticsPluginState, historyAnalyticsPluginKey } from './main';
import { StepMap, Step } from 'prosemirror-transform';

// todo: do i need this?
// todo: clean up and type
function isAdjacentToLastStep(
  transform: Transaction,
  prevMap: StepMap,
  done: { items: StepMap[] },
) {
  if (!prevMap) {
    return false;
  }
  var firstMap = transform.mapping.maps[0],
    adjacent = false;
  if (!firstMap) {
    return true;
  }
  firstMap.forEach((start: number, end: number) => {
    done.items.forEach(
      (item: Step) => {
        if (item.step) {
          prevMap.forEach(
            (_start: number, _end: number, rStart: number, rEnd: number) => {
              if (start <= rEnd && end >= rStart) {
                adjacent = true;
              }
            },
          );
          return false;
        } else {
          start = item.map.invert().map(start, -1);
          end = item.map.invert().map(end, 1);
        }
      },
      done.items.length,
      0,
    );
  });
  return adjacent;
}

const filterHistoryTransactions = (
  transactions: Transaction[],
): Transaction[] => {
  return transactions.filter(tr => {
    if (tr.steps.length === 0) {
      return false;
    }
    if (tr.getMeta(historyAnalyticsPluginKey) || tr.getMeta('history$')) {
      // todo: get history key better
      return false;
    }

    var appended = tr.getMeta('appendedTransaction');
    if ((appended || tr).getMeta('addToHistory') !== false) {
      const { prevTime } = HistoryState;
      const config = { newGroupDelay: 500 };
      var newGroup =
        prevTime < (tr.time || 0) - config.newGroupDelay ||
        (!appended &&
          !isAdjacentToLastStep(tr, HistoryState.prevMap, HistoryState.done));
      if (newGroup) {
        // todo: handle grouping and retaining analytics events
        return true;
      }
    }

    return false;
  });
};

export default (
  state: HistoryAnalyticsPluginState,
  action: HistoryAnalyticsAction,
) => {
  switch (action.type) {
    case HistoryAnalyticsActionTypes.PUSH:
      const trs = filterHistoryTransactions(action.transactions);
      if (trs.length > 0) {
        return {
          ...state,
          done: [...state.done, ...trs],
        };
      }
      return state;
    case HistoryAnalyticsActionTypes.UNDO:
      const tr = state.done[state.done.length - 1];
      if (tr) {
        // move transaction from done to undone
        return {
          done: state.done.splice(0, state.done.length - 1),
          undone: [...state.undone, tr],
        };
      } else {
        return state;
      }
    case HistoryAnalyticsActionTypes.REDO:
      // todo: redo
      return state;

    default:
      return state;
  }
};
