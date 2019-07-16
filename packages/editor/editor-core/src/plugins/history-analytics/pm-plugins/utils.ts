import { Transaction, EditorState, Plugin } from 'prosemirror-state';
import { Mapping } from 'prosemirror-transform';
import { HistoryAnalyticsPluginState } from './main';
import {
  AnalyticsEventPayloadWithChannel,
  analyticsPluginKey,
  addAnalytics,
} from '../../analytics';
import {
  PmHistoryPluginState,
  PmHistoryItem,
  PmHistoryBranch,
  PmHistoryPluginConfig,
  pmHistoryPluginKey,
  DEPTH_OVERFLOW,
} from './types';

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
  let updatedState = false;

  const newTransactions = transactions.reduce(
    (trs: Transaction[], tr: Transaction) => {
      const appended = tr.getMeta('appendedTransaction');
      if ((appended || tr).getMeta('addToHistory') !== false) {
        const pmHistoryPluginState: PmHistoryPluginState = getPmHistoryPluginState(
          state,
        );
        const { newGroupDelay } = getPmHistoryPluginConfig(state);
        var newGroup =
          pmHistoryPluginState.prevTime < (tr.time || 0) - newGroupDelay ||
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
              : pluginState.done[pluginState.done.length - 1];
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

  let { done, undone } = pluginState;
  if (updatedState) {
    done = [...done, ...newTransactions];
  }
  if (undone.length > 0) {
    undone = [];
  }

  const { depth } = getPmHistoryPluginConfig(state);
  if (done.length - depth > DEPTH_OVERFLOW) {
    done = done.slice(-depth);
  }

  if (pluginState.done === done && pluginState.undone === undone) {
    return pluginState;
  } else {
    return {
      done,
      undone,
    };
  }
};

/**
 * Ensure that this plugin's state is in sync with prosemirror-history's
 * If not, try and patch our plugin state to make it so
 */
export const syncWithPmHistory = (
  pluginState: HistoryAnalyticsPluginState,
  state: EditorState,
): HistoryAnalyticsPluginState => {
  let done: Transaction[] = pluginState.done;
  let undone: Transaction[] = pluginState.undone;
  let {
    done: pmHistoryDone,
    undone: pmHistoryUndone,
  } = getPmHistoryPluginState(state);
  const pmHistoryDoneItems = getEventCountBranchItems(pmHistoryDone);
  const pmHistoryUndoneItems = getEventCountBranchItems(pmHistoryUndone);

  if (areStacksDifferent(pluginState.done, pmHistoryDoneItems)) {
    done = syncStack(pluginState.done, pmHistoryDoneItems, state);
  }
  if (areStacksDifferent(pluginState.undone, pmHistoryUndoneItems)) {
    undone = syncStack(pluginState.undone, pmHistoryUndoneItems, state);
  }

  if (done === pluginState.done && undone === pluginState.undone) {
    return pluginState;
  }

  return { done, undone };
};

const getPmHistoryPluginState = (state: EditorState): PmHistoryPluginState => {
  return getPmHistoryPlugin(state).getState(state);
};

const getPmHistoryPluginConfig = (
  state: EditorState,
): PmHistoryPluginConfig => {
  return getPmHistoryPlugin(state).spec.config;
};

const getPmHistoryPlugin = (state: EditorState): Plugin => {
  // prosemirror-history does not export their plugin key
  return state.plugins.find(
    plugin => (plugin as any).key === pmHistoryPluginKey,
  ) as Plugin;
};

/**
 * Filters branch items to those that actually caused the branch's eventCount
 * property to increase
 */
const getEventCountBranchItems = (branch: PmHistoryBranch): PmHistoryItem[] =>
  branch.items.values.filter((value: PmHistoryItem) => value.selection);

const areStacksDifferent = (
  stack: Transaction[],
  pmHistoryStack: PmHistoryItem[],
): boolean => {
  if (stack.length !== pmHistoryStack.length) {
    return false;
  }
  if (stack.length === 0) {
    return true;
  }

  const lastTr = stack[stack.length - 1];
  const lastItem = pmHistoryStack[pmHistoryStack.length - 1];
  return lastTr.mapping.maps[lastTr.steps.length - 1] === lastItem.map;
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
