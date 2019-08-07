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
  /** Package name of the wrapped component (it will be added on payload) */
  packageName: string,
  /** Version of the wrapped component (it will be added on payload) */
  componentVersion: string,
  /** Name of the wrapped component (it will be added on payload) */
  componentName: string,
  /** The channel to listen for events on. */
  channel?: string,
};

export type AnalyticsErrorBoundaryState = {
  error: ?Error,
  info: ?AnalyticsErrorBoundaryErrorInfo,
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
  AnalyticsErrorBoundaryState,
> {
  state = {
    error: null,
    info: null,
  };

  fireAnalytics = (analyticsErrorPayload: AnalyticsErrorBoundaryPayload) => {
    const {
      createAnalyticsEvent,
      packageName,
      componentVersion,
      componentName,
      channel,
    } = this.props;

    if (typeof createAnalyticsEvent === 'function') {
      // Create our analytics event
      const analyticsEvent = createAnalyticsEvent({
        action: 'UnhandledError',
        eventType: 'ui',
        attributes: {
          browserInfo:
            window && window.navigator && window.navigator.userAgent
              ? window.navigator.userAgent
              : 'unknown',
          componentName,
          componentVersion,
          packageName,
          ...(isObject(analyticsErrorPayload) ? analyticsErrorPayload : {}),
        },
      });
      // Fire our analytics event on the 'atlaskit' channel
      analyticsEvent.fire(channel);
    }
  };

  componentDidCatch(
    error: Error,
    info?: AnalyticsErrorBoundaryErrorInfo,
  ): void {
    const { createAnalyticsEvent } = this.props;
    if (typeof createAnalyticsEvent === 'function') {
      const payload: AnalyticsErrorBoundaryPayload = {
        error,
        info,
      };
      // Fire our analytics event on the given channel
      this.fireAnalytics(payload);
    }

    this.setState({ error, info: info || null });
  }

  render() {
    const { packageName, componentVersion, componentName } = this.props;

    const analyticsContextData = {
      packageName,
      componentVersion,
      componentName,
    };

    return (
      <AnalyticsContext data={analyticsContextData}>
        {this.props.children}
      </AnalyticsContext>
    );
  }
}

const AnalyticsErrorBoundary = withAnalyticsEvents()(
  BaseAnalyticsErrorBoundary,
);

export default AnalyticsErrorBoundary;
