import {
  Transaction,
  EditorState,
  Plugin,
  TextSelection,
} from 'prosemirror-state';
import { Mapping, Step } from 'prosemirror-transform';
import { HistoryAnalyticsPluginState, invertedStepsMetaKey } from './main';
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
} from './prosemirror-history-types';

/**
 * Pushes relevant transactions into done stack
 * We try to do exactly what prosemirror-history does, and filter transactions and merge
 * steps and invert maps where they would
 * If transactions are not added into done stack, we ensure their analytics are not lost
 * so we can still fire undo events properly
 */
export const pushTransactionsToHistory = (
  transactions: Transaction[],
  pluginState: HistoryAnalyticsPluginState,
  state: EditorState,
): HistoryAnalyticsPluginState => {
  let shouldUpdateDone = false;

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
        shouldUpdateDone = true;

        if (newGroup) {
          return [
            ...trs,
            // add one item per step as prosemirror-history do
            ...tr.steps.map((step, idx) => splitTransaction(tr, idx, state)),
          ];
        } else {
          // We attempt to merge steps, and if successful update the map and store inverted
          // steps on the prev tr so we can compare against prosemirror-history's state
          // If merging fails then we want to add a new item into the done stack

          let lastTr = trs.length
            ? trs[trs.length - 1]
            : pluginState.done[pluginState.done.length - 1];

          if (lastTr) {
            let merged: Step | null | undefined;
            const invertedSteps = tr.steps.map((step, idx) =>
              step.invert(tr.docs[idx]),
            );
            const lastTrInvertedSteps: Step[] =
              lastTr.getMeta(invertedStepsMetaKey) || [];

            invertedSteps.forEach(step => {
              if (!merged) {
                merged = lastTrInvertedSteps[lastTrInvertedSteps.length - 1];
              }
              merged = step.merge(merged);
            });

            if (merged) {
              lastTr.mapping = new Mapping([merged.getMap().invert()]);
              lastTr.setMeta(invertedStepsMetaKey, [merged]);
            } else {
              return [
                ...trs,
                ...tr.steps.map((step, idx) =>
                  splitTransaction(tr, idx, state, false),
                ),
              ];
            }

            // extract this tr's analytics and apply to prev tr so we can fire undo
            // events properly
            const trAnalytics: AnalyticsEventPayloadWithChannel[] = tr.getMeta(
              analyticsPluginKey,
            );
            if (trAnalytics) {
              trAnalytics.forEach(analyticsPayload => {
                addAnalytics(
                  lastTr,
                  analyticsPayload.payload,
                  analyticsPayload.channel,
                );
              });
              return trs;
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
    if (undone.length > 0) {
      undone = [];
    }
  }

  // limit number of items we store to keep in sync with prosemirror-history
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
  state: EditorState,
): HistoryAnalyticsPluginState => {
  let done: Transaction[] = pluginState.done;
  let undone: Transaction[] = pluginState.undone;
  let { done: pmHistoryDone, undone: pmHistoryUndone } = pmHistoryPluginState;
  const pmHistoryDoneItems = getBranchItems(pmHistoryDone);
  const pmHistoryUndoneItems = getBranchItems(pmHistoryUndone);

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

/**
 * Copied from prosemirror-history, used to determine if a transaction is adjacent
 * to the previous one
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
      let i: number;
      for (i = stack.length - 1; i >= 0; i--) {
        const tr = stack[i];
        if (areStackItemsEqual(tr, lastItem)) {
          break;
        }
        if (areStackItemsInverse(tr, lastItem)) {
          tr.mapping = new Mapping([lastItem!.map]);
          break;
        }
      }
      if (i >= 0) {
        synced = stack.slice(0, i + 1);
      }
    } else {
      synced = [];
    }
  }

  // Our stack is missing some events
  // Add in filler transactions to make up the difference - these won't have
  // the analytics events we want but will at least keep us in sync
  if (eventDiff < 0) {
    if (
      areStackItemsEqual(lastTr, lastItem) ||
      areStackItemsInverse(lastTr, lastItem)
    ) {
      // if last items are the same but stacks are different length, something
      // has gone wrong and we need to start from scratch
      synced = rebuildStack(stack, pmHistoryStack, state);
    } else {
      synced = [...stack];
      for (let i = eventDiff; i < 0; i++) {
        synced.push(
          generateTrFromItem(pmHistoryStack[pmHistoryStack.length + i], state),
        );
      }
    }
  }

  lastTr = synced.length ? synced[synced.length - 1] : undefined;

  // prosemirror-history will invert the map sometimes which messes up our
  // comparisons, so if we detect this we just update our map to theirs
  if (areStackItemsInverse(lastTr, lastItem)) {
    lastTr!.mapping = new Mapping([lastItem!.map]);
  }

  // we are still too different, we need to rebuild completely
  if (
    !areStackItemsEqual(lastTr, lastItem) ||
    synced.length !== pmHistoryStack.length
  ) {
    synced = rebuildStack(stack, pmHistoryStack, state);
  }

  return synced;
};

/**
 * Something has gone terribly wrong and we need to rebuild our stack based off
 * prosemirror-history's
 * Analytics are preserved in transactions that are kept, but we can still lose them
 * so we really want to call this as infrequently as possible
 */
const rebuildStack = (
  stack: Transaction[],
  pmHistoryStack: PmHistoryItem[],
  state: EditorState,
): Transaction[] => {
  const newStack: Transaction[] = [];
  let startIdx = 0;
  pmHistoryStack.forEach(item => {
    for (let i = startIdx; i < stack.length; i++) {
      const tr = stack[i];
      if (areStackItemsEqual(tr, item)) {
        newStack.push(tr);
        break;
      }
      if (areStackItemsInverse(tr, item)) {
        tr.mapping = new Mapping([item.map]);
        newStack.push(tr);
        break;
      }

      if (i === stack.length - 1) {
        newStack.push(generateTrFromItem(item, state));
        startIdx = 0;
      }
    }
  });

  return newStack;
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

const getBranchItems = (branch: PmHistoryBranch): PmHistoryItem[] =>
  branch.items.values;

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

  const lastTr = stack[stack.length - 1];
  const lastItem = pmHistoryStack[pmHistoryStack.length - 1];

  return (
    !areStackItemsEqual(lastTr, lastItem) &&
    !areStackItemsInverse(lastTr, lastItem)
  );
};

const areStackItemsEqual = (tr?: Transaction, item?: PmHistoryItem) =>
  (!tr && !item) ||
  (tr && item && tr.mapping.maps[tr.steps.length - 1] === item.map);

function areStackItemsInverse(tr?: Transaction, item?: PmHistoryItem) {
  if (tr && item) {
    const invertedSteps = tr.getMeta(invertedStepsMetaKey);
    if (invertedSteps) {
      let map = invertedSteps[invertedSteps.length - 1].getMap();
      if ((tr.mapping.maps[tr.mapping.maps.length - 1] as any).inverted) {
        map = map.invert();
      }
      return map.ranges.every(
        (range: [number, number, number], idx: number) =>
          range === (item.map as any).ranges[idx],
      );
    }
  }
  return false;
}

export const generateTrFromItem = (
  item: PmHistoryItem,
  state: EditorState,
): Transaction => {
  const tr = new Transaction(state as any);
  tr.mapping = new Mapping([item.map]);
  tr.steps = [item.step];
  if (item.selection) {
    tr.setSelection(new TextSelection(state.doc.resolve(1)));
  }
  return tr;
};

const splitTransaction = (
  tr: Transaction,
  idx: number,
  state: EditorState,
  setSelection = true,
): Transaction => {
  const cloned = new Transaction(state as any);
  cloned.mapping = new Mapping([tr.mapping.maps[idx]]);
  cloned.steps = [tr.steps[idx]];
  if (idx === 0) {
    if (setSelection) {
      cloned.setSelection(new TextSelection(tr.doc.resolve(1)));
    }
    for (let metaKey in (tr as any).meta) {
      cloned.setMeta(metaKey, tr.getMeta(metaKey));
    }
  }

  const invertedSteps = tr.steps[idx].invert(tr.docs[idx]);
  cloned.setMeta(invertedStepsMetaKey, [invertedSteps]);

  return cloned;
};
