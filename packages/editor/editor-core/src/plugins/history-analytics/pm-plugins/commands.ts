import { createCommand, getPluginState } from './main';
import {
  analyticsPluginKey,
  addAnalytics,
  AnalyticsEventPayloadWithChannel,
  AnalyticsEventPayload,
} from '../../analytics';
import { HistoryAnalyticsActionTypes } from './actions';
import { Transaction, EditorState, Plugin } from 'prosemirror-state';

const findTransactionsToUndo = (state: EditorState): Transaction[] => {
  const { plugins } = state;
  const { done: transactions } = getPluginState(state);

  // Undoing auto-formatting is handled in a special way
  // prosemirror-inputrules doesn't have a plugin key so have to find
  // its state in this weird way
  const inputRulesPlugin: Plugin | undefined = plugins.find(
    plugin => plugin.spec.isInputRules,
  );
  if (inputRulesPlugin) {
    const undoableInputRule = inputRulesPlugin.getState(state);
    if (undoableInputRule) {
      return transactions.slice(-2);
    }
  }

  return transactions.slice(-1);
};

export const undo = createCommand(
  state => ({
    type: HistoryAnalyticsActionTypes.UNDO,
    transactions: findTransactionsToUndo(state),
  }),
  (tr, state) => {
    const pluginState = getPluginState(state);
    if (pluginState.done.length > 0) {
      const transactionsToUndo = findTransactionsToUndo(state);

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
