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
  let shouldUpdateDone = false;
  let shouldClearUndone = false;

  const newTransactions = transactions.reduce(
    (trs: Transaction[], tr: Transaction) => {
      const appended = tr.getMeta('appendedTransaction');
      if ((appended || tr).getMeta('addToHistory') !== false) {
        const pmHistoryPluginState: PmHistoryPluginState = getPmHistoryPluginState(
          state,
        );
        const { newGroupDelay } = getPmHistoryPluginConfig(state);
        const newGroup =
          pmHistoryPluginState.prevTime < (tr.time || 0) - newGroupDelay ||
          (!appended && !isAdjacentToLastStep(tr, pmHistoryPluginState));
        shouldClearUndone = true;

        if (newGroup) {
          // we want to add this transaction to done stack
          shouldUpdateDone = true;
          return [...trs, tr];
        } else {
          // we are skipping this transaction, but we want to add its analytics to the
          // last transaction so we can fire undo events properly
          const trAnalytics: AnalyticsEventPayloadWithChannel[] = tr.getMeta(
            analyticsPluginKey,
          );
          if (trAnalytics) {
            shouldUpdateDone = true;
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
  if (shouldUpdateDone) {
    done = [...done, ...newTransactions];
  }
  if (shouldClearUndone && undone.length > 0) {
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
  pmHistoryPluginState: PmHistoryPluginState,
): HistoryAnalyticsPluginState => {
  let done: Transaction[] = pluginState.done;
  let undone: Transaction[] = pluginState.undone;
  let { done: pmHistoryDone, undone: pmHistoryUndone } = pmHistoryPluginState;
  const pmHistoryDoneItems = getIndividualBranchItems(pmHistoryDone);
  const pmHistoryUndoneItems = getIndividualBranchItems(pmHistoryUndone);

  if (areStacksDifferent(pluginState.done, pmHistoryDoneItems)) {
    done = syncStack(pluginState.done, pmHistoryDoneItems);
  }
  if (areStacksDifferent(pluginState.undone, pmHistoryUndoneItems)) {
    undone = syncStack(pluginState.undone, pmHistoryUndoneItems);
  }

  if (done === pluginState.done && undone === pluginState.undone) {
    return pluginState;
  }

  return { done, undone };
};

export const getPmHistoryPluginState = (
  state: EditorState,
): PmHistoryPluginState => {
  return getPmHistoryPlugin(state).getState(state);
};

export const getPmHistoryPluginConfig = (
  state: EditorState,
): PmHistoryPluginConfig => {
  return getPmHistoryPlugin(state).spec.config;
};

export const getPmHistoryPlugin = (state: EditorState): Plugin => {
  // prosemirror-history does not export their plugin key
  return state.plugins.find(
    plugin => (plugin as any).key === pmHistoryPluginKey,
  ) as Plugin;
};

export const getPmInputRulesPluginState = (state: EditorState): boolean => {
  // prosemirror-inputrules doesn't have a plugin key
  const inputRulesPlugin: Plugin | undefined = state.plugins.find(
    plugin => plugin.spec.isInputRules,
  );
  if (inputRulesPlugin) {
    return inputRulesPlugin.getState(state);
  }
  return false;
};

/**
 * Filters branch items to those that actually caused the branch's eventCount
 * property to increase
 */
const getIndividualBranchItems = (branch: PmHistoryBranch): PmHistoryItem[] =>
  branch.items.values.filter((value: PmHistoryItem) => value.selection);

const areStacksDifferent = (
  stack: Transaction[],
  pmHistoryStack: PmHistoryItem[],
): boolean => {
  if (stack.length !== pmHistoryStack.length) {
    return true;
  }
  if (stack.length === 0) {
    return false;
  }

  return !isTransactionItemEqual(
    stack[stack.length - 1],
    pmHistoryStack[pmHistoryStack.length - 1],
  );
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
): Transaction[] => {
  let synced: Transaction[] = [...stack];
  const eventDiff = stack.length - pmHistoryStack.length;
  const lastItem = pmHistoryStack.length
    ? pmHistoryStack[pmHistoryStack.length - 1]
    : undefined;
  let lastTr = synced.length ? synced[synced.length - 1] : undefined;

  // Our stack has too many events
  // Find last item in our stack which matches prosemirror-history's and drop
  // all transactions after that
  if (eventDiff > 0) {
    if (pmHistoryStack.length) {
      let i;
      for (i = stack.length - 1; i >= 0; i--) {
        const tr = stack[i];
        if (isTransactionItemEqual(tr, lastItem)) {
          break;
        }
      }
      if (i >= 0) {
        synced = stack.slice(-i);
      }
    } else {
      synced = [];
    }
  }

  // Our stack is missing some events
  // Add in filler transactions to make up the difference - these won't have
  // the analytics events we want but will at least keep us in time
  if (eventDiff < 0) {
    if (isTransactionItemEqual(lastTr, lastItem)) {
      // if last items are the same but stacks are different length, something
      // has gone wrong and we need to start from scratch
      synced = rebuildStack(stack, pmHistoryStack);
    } else {
      synced = [...stack];
      for (let i = eventDiff; i < 0; i++) {
        synced.push(
          generateTrFromItem(pmHistoryStack[pmHistoryStack.length + i]),
        );
      }
    }
  }

  lastTr = synced.length ? synced[synced.length - 1] : undefined;
  if (
    !isTransactionItemEqual(lastTr, lastItem) ||
    synced.length !== pmHistoryStack.length
  ) {
    synced = rebuildStack(stack, pmHistoryStack);
  }

  return synced;
};

const isTransactionItemEqual = (tr?: Transaction, item?: PmHistoryItem) =>
  (!tr && !item) ||
  (tr && item && tr.mapping.maps[tr.steps.length - 1] === item.map);

/**
 * Something has gone terribly wrong and we need to rebuild our stack based
 * off prosemirror-history's
 * Analytics are preserved in transactions that are kept
 */
const rebuildStack = (
  stack: Transaction[],
  pmHistoryStack: PmHistoryItem[],
): Transaction[] => {
  const newStack: Transaction[] = [];
  let startIdx = 0;
  pmHistoryStack.forEach(item => {
    for (let i = startIdx; i < stack.length; i++) {
      const tr = stack[i];
      if (isTransactionItemEqual(tr, item)) {
        newStack.push(tr);
        break;
      }

      if (i === stack.length - 1) {
        newStack.push(generateTrFromItem(item));
        startIdx = 0;
      }
    }
  });

  return newStack;
};

export const generateTrFromItem = (item: PmHistoryItem): Transaction => {
  const tr = new Transaction({} as any);
  tr.mapping = new Mapping([item.map]);
  tr.steps = [item.step];
  return tr;
};
