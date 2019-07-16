import { Transaction, EditorState } from 'prosemirror-state';
import { Mapping } from 'prosemirror-transform';
import { historyAnalyticsPluginKey, HistoryAnalyticsPluginState } from './main';
import {
  AnalyticsEventPayloadWithChannel,
  analyticsPluginKey,
  addAnalytics,
} from '../../analytics';
import { PmHistoryPluginState, PmHistoryItem, PmHistoryBranch } from './types';

// prosemirror-history does not exports its plugin key
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
        const pmHistoryPluginState: PmHistoryPluginState = getPmHistoryPluginState(
          state,
        );
        var newGroup =
          pmHistoryPluginState.prevTime < (tr.time || 0) - 500 ||
          (!appended && !isAdjacentToLastStep(tr, pmHistoryPluginState));
        updatedState = true;

        if (newGroup) {
          // we want to add this transaction to done stack
          return [...trs, tr];
        } else {
          // we are skipping this transaction, but we want to add its analytics to the
          // last transaction so we can fire undo events properly
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
 * If not, try and patch our plugin state to make it so
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
  const pmHistoryDoneItems = getEventCountBranchItems(pmHistoryDone);
  const pmHistoryUndoneItems = getEventCountBranchItems(pmHistoryUndone);

  if (done.length !== pmHistoryDoneItems.length) {
    done = syncStack(done, pmHistoryDoneItems, state);
  }
  if (undone.length !== pmHistoryUndoneItems.length) {
    undone = syncStack(undone, pmHistoryUndoneItems, state);
  }

  return { done, undone };
};

const getPmHistoryPluginState = (state: EditorState): PmHistoryPluginState => {
  // prosemirror-history does not export their plugin key
  const pmHistoryPlugin = state.plugins.find(
    plugin => (plugin as any).key === pmHistoryPluginKey,
  );
  return pmHistoryPlugin!.getState(state);
};

/**
 * Copied from prosemirror-history, used to determine if a transaction should be added
 * to done stack or skipped over as it was so close to previous one
 */
const isAdjacentToLastStep = (
  tr: Transaction,
  pmHistoryPluginState: PmHistoryPluginState,
): boolean => {
  const { prevMap, done } = pmHistoryPluginState;
  const firstMap = tr.mapping.maps[0];
  if (!prevMap) {
    return false;
  }
  if (!firstMap) {
    return true;
  }

  let adjacent = false;
  firstMap.forEach((start: number, end: number) => {
    done.items.forEach(
      (item: PmHistoryItem) => {
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
        return;
      },
      done.items.length,
      0,
    );
  });

  return adjacent;
};

/**
 * Filters branch items to those that actually caused the branch's eventCount
 * property to increase
 */
const getEventCountBranchItems = (branch: PmHistoryBranch): PmHistoryItem[] =>
  branch.items.values.filter((value: PmHistoryItem) => value.selection);

const syncStack = (
  stack: Transaction[],
  pmHistoryStack: PmHistoryItem[],
  state: EditorState,
): Transaction[] => {
  const eventDiff = stack.length - pmHistoryStack.length;

  // Our stack has too many events
  // Find last item in our stack which matches prosemirror-history's and drop
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

  // Our stack is missing some events
  // Add in filler transactions to make up the difference - these won't have
  // the analytics events we want but will at least keep us in time
  if (eventDiff < 0) {
    stack = [...stack];
    for (let i = eventDiff; i < 0; i++) {
      stack.push(
        generateTrFromItem(pmHistoryStack[pmHistoryStack.length + i], state),
      );
    }
    return stack;
  }
  return stack;
};

const generateTrFromItem = (
  item: PmHistoryItem,
  state: EditorState,
): Transaction => {
  const tr = new Transaction(state as any); // the type for this is wrong
  tr.mapping = new Mapping([item.map]);
  tr.steps = [item.step];
  return tr;
};
