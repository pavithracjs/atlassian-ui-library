import { createCommand, getPluginState } from './main';
import {
  analyticsPluginKey,
  addAnalytics,
  AnalyticsEventPayload,
  ACTION,
  EVENT_TYPE,
  AEPExcludingHistoryWithChannel,
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

    const analyticsMeta: AEPExcludingHistoryWithChannel[] = transactionsToUndo.reduce(
      (analytics: AEPExcludingHistoryWithChannel[], tr: Transaction) => {
        const trAnalytics: AEPExcludingHistoryWithChannel[] = tr.getMeta(
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
          (analytics): AnalyticsEventPayload => ({
            action: ACTION.UNDID,
            actionSubject: analytics.payload.actionSubject,
            actionSubjectId: analytics.payload.action,
            attributes: {
              ...analytics.payload.attributes,
              actionSubjectId: analytics.payload.actionSubjectId,
            },
            eventType: EVENT_TYPE.TRACK,
          }),
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
