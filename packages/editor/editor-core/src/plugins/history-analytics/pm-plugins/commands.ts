import { createCommand, getPluginState } from './main';
import {
  analyticsPluginKey,
  addAnalytics,
  AnalyticsEventPayloadWithChannel,
  AnalyticsEventPayload,
  ACTION,
  HistoryEventPayload,
} from '../../analytics';
import { HistoryAnalyticsActionTypes } from './actions';
import { Transaction, EditorState } from 'prosemirror-state';
import { getPmInputRulesPluginState } from './utils';

export const undo = createCommand(
  state => ({
    type: HistoryAnalyticsActionTypes.UNDO,
    transactions: findTransactionsToUndo(state),
  }),
  // inspect transactions we are going to undo for analytics meta and create a new
  // undo analytics event from any that we find and add these to the current transaction
  (tr, state) => {
    const transactionsToUndo = findTransactionsToUndo(state);

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
    if (analyticsMeta.length > 0) {
      analyticsMeta
        .map(
          (analytics): AnalyticsEventPayload =>
            ({
              action: ACTION.UNDID,
              actionSubject: analytics.payload.actionSubject,
              actionSubjectId: analytics.payload.action,
              attributes: {
                ...analytics.payload.attributes,
                actionSubject: analytics.payload.actionSubject,
                actionSubjectId: analytics.payload.actionSubjectId,
              },
            } as HistoryEventPayload),
        )
        .forEach(analyticsPayload => {
          addAnalytics(tr, analyticsPayload);
        });
    }
    return tr;
  },
);

const findTransactionsToUndo = (state: EditorState): Transaction[] => {
  const { done } = getPluginState(state);
  if (done.length === 0) {
    return done;
  }

  // undoing auto-formatting is handled in a special way by prosemirror-inputrules
  const undoableInputRule = getPmInputRulesPluginState(state);
  if (undoableInputRule) {
    return done.slice(-2);
  }

  return done.slice(-1);
};
