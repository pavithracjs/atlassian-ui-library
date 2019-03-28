import * as React from 'react';
import * as throttle from 'lodash.throttle';
import now from '../utils/performance-now';
import { prefetchAll } from '../providers/instance-data-providers';
import {
  NAVIGATION_CHANNEL,
  NavigationAnalyticsContext,
  OPERATIONAL_EVENT_TYPE,
  TRIGGER_COMPONENT,
  TRIGGER_SUBJECT,
  withAnalyticsEvents,
} from '../utils/analytics';
import {
  AnalyticsEventPayload,
  WithAnalyticsEventProps,
} from '@atlaskit/analytics-next-types';
import packageContext from '../utils/package-context';

const THROTTLE_EXPIRES = 60 * 1000; // 60 seconds
const THROTTLE_OPTIONS = {
  leading: true,
  trailing: false,
};

const TRIGGER_CONTEXT = {
  componentName: TRIGGER_COMPONENT,
  ...packageContext,
};

interface PrefetchTriggerProps {
  cloudId: string;
  Container?: React.ReactType;
}

class PrefetchTrigger extends React.Component<
  PrefetchTriggerProps & WithAnalyticsEventProps
> {
  private lastEnteredAt?: number;

  private fireOperationalEvent = (payload: AnalyticsEventPayload) => {
    if (this.props.createAnalyticsEvent) {
      this.props
        .createAnalyticsEvent({
          eventType: OPERATIONAL_EVENT_TYPE,
          actionSubject: TRIGGER_SUBJECT,
          ...payload,
        })
        .fire(NAVIGATION_CHANNEL);
    }
  };

  private triggerPrefetch: typeof prefetchAll = throttle(
    (params: any) => {
      prefetchAll(params);
      this.fireOperationalEvent({
        action: 'triggered',
      });
    },
    THROTTLE_EXPIRES,
    THROTTLE_OPTIONS,
  );

  private handleMouseEnter = () => {
    this.triggerPrefetch({ cloudId: this.props.cloudId });
    this.lastEnteredAt = now();
  };

  private handleMouseClick = () => {
    if (this.lastEnteredAt) {
      const hoverToClick = Math.round(now() - this.lastEnteredAt);

      this.fireOperationalEvent({
        action: 'clicked',
        attributes: { hoverToClick },
      });
    }
  };

  render() {
    const { children, Container = 'div' } = this.props;
    return (
      <Container
        onFocus={this.handleMouseEnter}
        onMouseEnter={this.handleMouseEnter}
        onClick={this.handleMouseClick}
      >
        {children}
      </Container>
    );
  }
}

const PrefetchTriggerWithEvents = withAnalyticsEvents()(PrefetchTrigger);

export default (props: PrefetchTriggerProps) => (
  <NavigationAnalyticsContext data={TRIGGER_CONTEXT}>
    <PrefetchTriggerWithEvents {...props} />
  </NavigationAnalyticsContext>
);
