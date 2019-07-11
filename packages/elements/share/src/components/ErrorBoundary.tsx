import * as React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import {
  AnalyticsEventPayload,
  WithAnalyticsEventProps,
  withAnalyticsEvents,
} from '@atlaskit/analytics-next';
import { Reason } from '../types';
import { errorToReason } from './utils';

type ErrorBoundaryProps = InjectedIntlProps & WithAnalyticsEventProps;

type ErrorBoundaryState = {
  hasError: boolean;
  reason?: Reason;
};

class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { hasError: false };

  fireOperationalEvent = (payload: AnalyticsEventPayload) => {
    if (this.props.createAnalyticsEvent) {
      this.props.createAnalyticsEvent(payload).fire('fabric-elements');
    }
  };

  componentDidCatch(error: any) {
    const reason = errorToReason(error);

    this.setState({
      hasError: true,
      reason,
    });
  }

  render() {
    const { hasError } = this.state;
    if (hasError) {
      // Silently fail.
      return null;
    }
    return this.props.children;
  }
}

export default withAnalyticsEvents()(injectIntl(ErrorBoundary));
