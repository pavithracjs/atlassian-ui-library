import NotificationIndicator, { Props } from './NotificationIndicator';
import { withAnalyticsEvents } from '@atlaskit/analytics-next';

const NotificationIndicatorWithAnalytics = withAnalyticsEvents<Props>()(
  NotificationIndicator,
);
export { NotificationIndicatorWithAnalytics as NotificationIndicator };
