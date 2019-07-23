import { createCommand, getPluginState } from './main';
import {
  analyticsPluginKey,
  addAnalytics,
  AnalyticsEventPayload,
  ACTION,
  EVENT_TYPE,
  AEPExcludingHistoryWithChannel,
  TABLE_ACTION,
  HISTORY_ACTION,
} from '../../analytics';
import { HistoryAnalyticsActionTypes } from './actions';
import { Transaction, EditorState } from 'prosemirror-state';

const actionsToIgnore: (ACTION | TABLE_ACTION)[] = [
  ACTION.INVOKED,
  ACTION.OPENED,
];

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
        .filter(
          analytics => actionsToIgnore.indexOf(analytics.payload.action) === -1,
        )
        .map(
          (analytics): AnalyticsEventPayload => ({
            action: HISTORY_ACTION.UNDID,
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
    return [];
  }

  // The latest transaction we find with a selection is the one we want to remove up to (and including)
  // This is how prosemirror-history's undo works
  let i: number;
  for (i = done.length - 1; i >= 0; i--) {
    if (done[i].selectionSet) {
      break;
    }
  }

  return done.slice(-(done.length - i));
};
