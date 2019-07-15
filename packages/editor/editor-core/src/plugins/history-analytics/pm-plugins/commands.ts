import { createCommand, getPluginState } from './main';
import {
  analyticsPluginKey,
  addAnalytics,
  AnalyticsEventPayloadWithChannel,
  AnalyticsEventPayload,
} from '../../analytics';
import { HistoryAnalyticsActionTypes } from './actions';
import { Transaction, EditorState } from 'prosemirror-state';

const findTransactionsToUndo = (
  state: EditorState,
  transactions: Transaction[],
): Transaction[] => {
  const { plugins } = state;
  // prosemirror-inputrules doesn't have a plugin key (!)
  const inputRulesPlugin = plugins.find(plugin => plugin.spec.isInputRules);
  if (inputRulesPlugin) {
    const undoableInputRule = inputRulesPlugin.getState(state);
    if (undoableInputRule) {
      return transactions.splice(transactions.length - 2);
    }
  }

  return transactions.splice(transactions.length - 1);
};

export const undo = createCommand(
  {
    type: HistoryAnalyticsActionTypes.UNDO,
  },
  (tr, state) => {
    const pluginState = getPluginState(state);
    console.log(pluginState);
    if (pluginState.done.length > 0) {
      const transactionsToUndo = findTransactionsToUndo(
        state,
        pluginState.done,
      );

      // inspect for analytics meta
      const analyticsMeta: AnalyticsEventPayloadWithChannel[] = transactionsToUndo.reduce(
        (analytics: AnalyticsEventPayloadWithChannel[], tr: Transaction) => {
          const trAnalytics: AnalyticsEventPayloadWithChannel[] = tr.getMeta(
            analyticsPluginKey,
          );
          if (trAnalytics) {
            return [...analytics, ...trAnalytics];
          }
          return analytics;
        },
        [],
      );
      if (analyticsMeta && analyticsMeta.length > 0) {
        analyticsMeta
          .map(analytics => ({
            // todo: type
            ...analytics.payload,
            action: 'undo',
            actionSubjectId: analytics.payload.action,
            attributes: {
              ...analytics.payload.attributes,
              actionSubject: analytics.payload.actionSubject,
              actionSubjectId: analytics.payload.actionSubjectId,
            },
          }))
          .forEach(analyticsPayload => {
            addAnalytics(tr, analyticsPayload as AnalyticsEventPayload);
          });
      }
    }
    return tr;
  },
);
