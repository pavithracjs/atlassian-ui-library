import { useContext } from 'react';

import { AnalyticsReactContext } from './AnalyticsReactContext';
import { CreateUIAnalyticsEvent } from './types';
import UIAnalyticsEvent from './UIAnalyticsEvent';
import { AnalyticsEventPayload } from './AnalyticsEvent';

export type UseAnalyticsEventsHook = {
  createAnalyticsEvent: CreateUIAnalyticsEvent;
};

export function useAnalyticsEvents(): UseAnalyticsEventsHook {
  const {
    getAtlaskitAnalyticsEventHandlers,
    getAtlaskitAnalyticsContext,
  } = useContext(AnalyticsReactContext);

  const createAnalyticsEvent = (
    payload: AnalyticsEventPayload,
  ): UIAnalyticsEvent =>
    new UIAnalyticsEvent({
      context: getAtlaskitAnalyticsContext(),
      handlers: getAtlaskitAnalyticsEventHandlers(),
      payload,
    });

  return {
    createAnalyticsEvent,
  };
}
