import {
  UIAnalyticsEvent,
  CreateUIAnalyticsEvent,
  AnalyticsEventPayload,
} from '@atlaskit/analytics-next';

const mock: CreateUIAnalyticsEvent = (
  payload: AnalyticsEventPayload,
): UIAnalyticsEvent => ({
  context: [],
  handlers: [],
  hasFired: false,
  payload,
  clone() {
    return null;
  },
  fire() {},
  update(_updater) {
    return mock(payload);
  },
});

export default function createAnalyticsEventMock(): jest.MockInstance<
  UIAnalyticsEvent,
  any
> {
  return jest.fn(mock);
}
