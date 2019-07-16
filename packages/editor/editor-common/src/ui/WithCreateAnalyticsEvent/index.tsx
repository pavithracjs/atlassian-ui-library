import * as React from 'react';
import {
  withAnalyticsEvents,
  WithAnalyticsEventProps,
  CreateUIAnalyticsEventSignature,
} from '@atlaskit/analytics-next';

export type Props = {
  render: (
    createAnalyticsEvent?: CreateUIAnalyticsEventSignature,
  ) => React.ReactNode;
};

export const WithCreateAnalyticsEvent: React.ComponentType<
  Props
> = withAnalyticsEvents<Props>()(
  class WithCreateAnalyticsEvent extends React.Component<
    Props & WithAnalyticsEventProps
  > {
    render() {
      const { render, createAnalyticsEvent } = this.props;
      return render(createAnalyticsEvent);
    }
  },
);
