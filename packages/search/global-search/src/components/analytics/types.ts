import { GasPayload } from '@atlaskit/analytics-gas-types';

export type AnalyticsNextEvent = {
  payload: GasPayload;
  context: Array<any>;
  update: (payload: GasPayload) => AnalyticsNextEvent;
  fire: (string: string) => AnalyticsNextEvent;
};

export type CreateAnalyticsEventFn = () => AnalyticsNextEvent;
