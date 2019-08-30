import { useContext, useEffect } from 'react';

import { AnalyticsReactContext } from './AnalyticsReactContext';
import { CreateUIAnalyticsEvent } from './types';
import UIAnalyticsEvent from './UIAnalyticsEvent';
import { AnalyticsEventPayload } from './AnalyticsEvent';

export type UseAnalyticsEventsHook = {
  createAnalyticsEvent: CreateUIAnalyticsEvent;
};

export function useAnalyticsEvents_experimental(): UseAnalyticsEventsHook {
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

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      // eslint-disable-next-line no-console
      console.warn(
        `The useAnalyticsEvents_experimental hook should be used with caution.
        It's consumers must be wrapped with the updated AnalyticsListener and AnalyticsContext components from the latest release of @atlaskit/analytics-next.`,
      );
    }
  }, []);

  return {
    createAnalyticsEvent,
  };
}
