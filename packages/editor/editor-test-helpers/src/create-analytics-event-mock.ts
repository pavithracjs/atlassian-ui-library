import {
  UIAnalyticsEventInterface,
  AnalyticsEventUpdater,
  CreateUIAnalyticsEventSignature,
  AnalyticsEventPayload,
} from '@atlaskit/analytics-next';

const mock: CreateUIAnalyticsEventSignature = (
  payload: AnalyticsEventPayload,
): UIAnalyticsEventInterface => ({
  context: [],
  hasFired: false,
  payload,
  clone() {
    return null;
  },
  fire() {},
  update(_updater: AnalyticsEventUpdater): UIAnalyticsEventInterface {
    return mock(payload);
  },
});

export default function createAnalyticsEventMock(): jest.MockInstance<
  UIAnalyticsEventInterface
> {
  return jest.fn(mock);
}
