import { Transaction, EditorState } from 'prosemirror-state';
import { historyAnalyticsPluginKey, HistoryAnalyticsPluginState } from './main';
import { StepMap, Step, Mapping } from 'prosemirror-transform';
import {
  AnalyticsEventPayloadWithChannel,
  analyticsPluginKey,
  addAnalytics,
} from '../../analytics';
import { Node } from 'prosemirror-model';

const pmHistoryPluginKey = 'history$';

/**
 * Pushes relevant transactions into done stack
 * Transactions are filtered, only storing those that prosemirror-history would also add to
 * its plugin state
 * If transactions are skipped, we ensure their analytics are not lost so we can still fire
 * undo events properly
 */
export const pushTransactionsToHistory = (
  transactions: Transaction[],
  pluginState: HistoryAnalyticsPluginState,
  state: EditorState,
): HistoryAnalyticsPluginState => {
  const done = [...pluginState.done];
  let updatedState = false;

  const newTransactions = transactions.reduce(
    (trs: Transaction[], tr: Transaction) => {
      if (
        tr.steps.length === 0 ||
        tr.getMeta(historyAnalyticsPluginKey) ||
        tr.getMeta(pmHistoryPluginKey)
      ) {
        return trs;
      }

      const appended = tr.getMeta('appendedTransaction');
      if ((appended || tr).getMeta('addToHistory') !== false) {
        const {
          prevTime,
          prevMap,
          done: pmHistoryDone,
        } = getPmHistoryPluginState(state);
        var newGroup =
          prevTime < (tr.time || 0) - 500 ||
          (!appended && !isAdjacentToLastStep(tr, prevMap, pmHistoryDone));
        updatedState = true;

        if (newGroup) {
          return [...trs, tr];
        } else {
          // if we are skipping this transaction, we want to add its analytics to the
          // last transaction
          const trAnalytics: AnalyticsEventPayloadWithChannel[] = tr.getMeta(
            analyticsPluginKey,
          );
          if (trAnalytics) {
            let lastTr = trs.length
              ? trs[trs.length - 1]
              : done[done.length - 1];
            if (lastTr) {
              trAnalytics.forEach(analyticsPayload => {
                addAnalytics(
                  lastTr,
                  analyticsPayload.payload,
                  analyticsPayload.channel,
                );
              });
              return [...trs.slice(0, trs.length - 1), lastTr];
            }
          }
        }
      }

      return trs;
    },
    [],
  );

  if (updatedState) {
    return {
      done: [...done, ...newTransactions],
      undone: [],
    };
  }
  if (pluginState.undone.length > 0) {
    return {
      ...pluginState,
      undone: [],
    };
  }
  return pluginState;
};

/**
 * Ensure that this plugin's state is in sync with prosemirror-history's
 * If not, patch our plugin state to make it so
 */
export const syncWithPmHistory = (
  pluginState: HistoryAnalyticsPluginState,
  state: EditorState,
): HistoryAnalyticsPluginState => {
  let { done, undone } = pluginState;
  let {
    done: pmHistoryDone,
    undone: pmHistoryUndone,
  } = getPmHistoryPluginState(state);
  pmHistoryDone = pmHistoryDone.items.values.filter(value => value.selection);
  pmHistoryUndone = pmHistoryUndone.items.values.filter(
    value => value.selection,
  );

  if (done.length !== pmHistoryDone.length) {
    done = syncStack(done, pmHistoryDone, state);
  }
  if (undone.length !== pmHistoryUndone.length) {
    undone = syncStack(undone, pmHistoryUndone, state);
  }

  return { done, undone };
};

const syncStack = (
  stack: Transaction[],
  pmHistoryStack: any[], // todo: type
  state: EditorState,
): Transaction[] => {
  const eventDiff = stack.length - pmHistoryStack.length;

  // find last item in stack which matches prosemirror-history's and remove
  // all transactions after that
  if (eventDiff > 0) {
    if (pmHistoryStack.length > 0) {
      const lastMap = pmHistoryStack[pmHistoryStack.length - 1].map;
      let i;
      for (i = stack.length - 1; i >= 0; i--) {
        const tr = stack[i];
        if (tr.mapping.maps[tr.steps.length - 1] === lastMap) {
          break;
        }
      }
      if (i >= 0) {
        return stack.slice(-i);
      }
    } else {
      return [];
    }
  }

  // add in filler transactions to make up the difference
  if (eventDiff < 0) {
    stack = [...stack];
    for (
      let i = pmHistoryStack.length + eventDiff;
      i < pmHistoryStack.length;
      i++
    ) {
      stack.push(generateTrFromItem(pmHistoryStack[i], state.doc));
    }
    return stack;
  }
  return stack;
};

// todo: type
const generateTrFromItem = (item: any, doc: Node): Transaction => {
  const tr = new Transaction(doc);
  // todo: none of the settings are applied
  tr.time = item.time;
  tr.mapping = new Mapping(item.map);
  tr.steps = [item.step];
  return tr;
};

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

const getPmHistoryPluginState = (state: EditorState): any => {
  // todo: type
  return state[pmHistoryPluginKey];
};
