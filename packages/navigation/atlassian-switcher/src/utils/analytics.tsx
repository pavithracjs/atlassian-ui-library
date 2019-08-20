import * as React from 'react';
import { NavigationAnalyticsContext } from '@atlaskit/analytics-namespaced-context';
import {
  createAndFireEvent,
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
  CreateUIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import {
  UI_EVENT_TYPE,
  OPERATIONAL_EVENT_TYPE,
} from '@atlaskit/analytics-gas-types';

type PropsToContextMapper<P, C> = (props: P) => C;

export const NAVIGATION_CHANNEL = 'navigation';
export const SWITCHER_SUBJECT = 'atlassianSwitcher';
export const SWITCHER_ITEM_SUBJECT = 'atlassianSwitcherItem';
export const SWITCHER_CHILD_ITEM_SUBJECT = 'atlassianSwitcherChildItem';
export const SWITCHER_ITEM_EXPAND_SUBJECT = 'atlassianSwitcherItemExpand';
export const SWITCHER_COMPONENT = 'atlassianSwitcher';
export const SWITCHER_SOURCE = 'atlassianSwitcher';
export const TRIGGER_COMPONENT = 'atlassianSwitcherPrefetch';
export const TRIGGER_SUBJECT = 'atlassianSwitcherPrefetch';

export const createAndFireNavigationEvent = createAndFireEvent(
  NAVIGATION_CHANNEL,
);

export const analyticsAttributes = <T extends object>(attributes: T) => ({
  attributes,
});

export const withAnalyticsContextData = function<P, C>(
  mapPropsToContext: PropsToContextMapper<P, C>,
) {
  return function(
    WrappedComponent: React.ComponentType<P>,
  ): React.ComponentType<P> {
    return props => (
      <NavigationAnalyticsContext data={mapPropsToContext(props)}>
        <WrappedComponent {...props} />
      </NavigationAnalyticsContext>
    );
  };
};

interface RenderTrackerProps extends WithAnalyticsEventsProps {
  subject: string;
  data?: object;
  onRender?: any;
}

export const RenderTracker = withAnalyticsEvents({
  onRender: (
    createAnalyticsEvent: CreateUIAnalyticsEvent,
    props: RenderTrackerProps,
  ) => {
    return createAnalyticsEvent({
      eventType: OPERATIONAL_EVENT_TYPE,
      action: 'rendered',
      actionSubject: props.subject,
      attributes: props.data,
    }).fire(NAVIGATION_CHANNEL);
  },
})(
  class extends React.Component<RenderTrackerProps> {
    componentDidMount() {
      this.props.onRender();
    }

    render() {
      return null;
    }
  },
);

export const ViewedTracker = withAnalyticsEvents({
  onRender: (
    createAnalyticsEvent: CreateUIAnalyticsEvent,
    props: RenderTrackerProps,
  ) => {
    return createAnalyticsEvent({
      eventType: UI_EVENT_TYPE,
      action: 'viewed',
      actionSubject: SWITCHER_SUBJECT,
      attributes: props.data,
    }).fire(NAVIGATION_CHANNEL);
  },
})(
  class extends React.Component<RenderTrackerProps> {
    componentDidMount() {
      this.props.onRender();
    }

    render() {
      return null;
    }
  },
);

export {
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
  NavigationAnalyticsContext,
  OPERATIONAL_EVENT_TYPE,
  UI_EVENT_TYPE,
};
