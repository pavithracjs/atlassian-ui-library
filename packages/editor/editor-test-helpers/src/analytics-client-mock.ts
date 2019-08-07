import { AnalyticsWebClient } from '@atlaskit/analytics-listeners/types';
import {
  GasPurePayload,
  GasPureScreenEventPayload,
} from '@atlaskit/analytics-gas-types';

type AnalyticsEventHandler = (
  event: GasPurePayload | GasPureScreenEventPayload,
) => void;

export const analyticsClient = (
  analyticsEventHandler: AnalyticsEventHandler = jest.fn(),
): AnalyticsWebClient => {
  return {
    sendUIEvent: analyticsEventHandler,
    sendOperationalEvent: analyticsEventHandler,
    sendTrackEvent: analyticsEventHandler,
    sendScreenEvent: analyticsEventHandler,
  };
};
