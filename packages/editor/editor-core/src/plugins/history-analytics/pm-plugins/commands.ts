import { createCommand, getPluginState } from './main';
import {
  analyticsPluginKey,
  addAnalytics,
  AnalyticsEventPayloadWithChannel,
  AnalyticsEventPayload,
} from '../../analytics';
import { HistoryAnalyticsActionTypes } from './actions';

export const undo = createCommand(
  {
    type: HistoryAnalyticsActionTypes.UNDO,
  },
  (tr, state) => {
    const pluginState = getPluginState(state);
    console.log(pluginState);
    // pop x transactions off stack
    if (pluginState.done.length > 0) {
      const trToUndo = pluginState.done[pluginState.done.length - 1];

      // inspect for analytics meta
      const analyticsMeta: AnalyticsEventPayloadWithChannel[] = trToUndo.getMeta(
        analyticsPluginKey,
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
