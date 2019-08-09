// @flow
import React, { type Node, Component } from 'react';
import withAnalyticsEvents, {
  type WithAnalyticsEventsProps,
} from './withAnalyticsEvents';
import AnalyticsContext from './AnalyticsContext';

type AnalyticsErrorBoundaryErrorInfo = {
  componentStack: string,
};

export type AnalyticsErrorBoundaryProps = {
  ...$Exact<WithAnalyticsEventsProps>,
  /** React component to be wrapped */
  children: Node,
  channel: string,
  data: {},
};

type AnalyticsErrorBoundaryPayload = {
  error: ?Error | string,
  info?: ?AnalyticsErrorBoundaryErrorInfo,
  [key: string]: any,
};

const isObject = (o: any) =>
  typeof o === 'object' && o !== null && !Array.isArray(o);

export class BaseAnalyticsErrorBoundary extends Component<
  AnalyticsErrorBoundaryProps,
  {},
> {
  fireAnalytics = (analyticsErrorPayload: AnalyticsErrorBoundaryPayload) => {
    const { createAnalyticsEvent, channel, data } = this.props;

    // Create our analytics event
    const analyticsEvent = createAnalyticsEvent({
      action: 'UnhandledError',
      eventType: 'ui',
      attributes: {
        browserInfo:
          window && window.navigator && window.navigator.userAgent
            ? window.navigator.userAgent
            : 'unknown',
        ...data,
        ...(isObject(analyticsErrorPayload) ? analyticsErrorPayload : {}),
      },
    });

    // Fire our analytics event on the channel
    analyticsEvent.fire(channel);
  };

  componentDidCatch(
    error: Error,
    info?: AnalyticsErrorBoundaryErrorInfo,
  ): void {
    const payload: AnalyticsErrorBoundaryPayload = {
      error,
      info,
    };

    this.fireAnalytics(payload);
  }

  render() {
    const { data, children } = this.props;
    return <AnalyticsContext data={data}>{children}</AnalyticsContext>;
  }
}

const AnalyticsErrorBoundary = withAnalyticsEvents()(
  BaseAnalyticsErrorBoundary,
);

export default AnalyticsErrorBoundary;
