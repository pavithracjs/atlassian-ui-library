// @flow

import type { ComponentType, ElementConfig } from 'react';

import {
  withAnalyticsEvents,
  withAnalyticsContext,
} from '@atlaskit/analytics-next';
import type { ViewLayer } from '../view-controller/types';

type BaseItemClicked = {
  action: string,
  actionSubject: 'navigationItem',
  attributes: {
    componentName: string,
    iconSource: ?string,
    navigationItemIndex: number,
  },
};

type GlobalItemClicked = BaseItemClicked & {
  actionSubjectId: string,
};

type ContainerItemClicked = {
  ...BaseItemClicked,
  attributes: {
    ...$PropertyType<BaseItemClicked, 'attributes'>,
    itemId: string,
  },
};

type AnalyticsContextWrappedComp<C> = ComponentType<{
  analyticsContext?: {},
  ...$Exact<ElementConfig<$Supertype<C>>>,
}>;

type AnalyticsEventsWrappedComp<C> = ComponentType<
  $Diff<ElementConfig<$Supertype<C>>, { createAnalyticsEvent: any }>,
>;

export const navigationChannel = 'navigation';

const getDisplayName = component =>
  component ? component.displayName || component.name : undefined;

const kebabToCamelCase = (str: string) =>
  `${str}`.replace(/-([a-z])/gi, g => g[1].toUpperCase());

export const navigationItemClicked = <P: {}, C: ComponentType<P>>(
  Component: C,
  componentName: string,
  useActionSubjectId: boolean = false,
): AnalyticsContextWrappedComp<AnalyticsEventsWrappedComp<C>> => {
  return withAnalyticsContext({
    componentName,
  })(
    withAnalyticsEvents({
      onClick: (createAnalyticsEvent, props) => {
        const id = kebabToCamelCase(props.id);
        const basePayload = {
          action: 'clicked',
          actionSubject: 'navigationItem',
          attributes: {
            componentName,
            iconSource:
              getDisplayName(props.icon) || getDisplayName(props.before),
            navigationItemIndex: props.index,
          },
        };

        let payload: ContainerItemClicked | GlobalItemClicked;
        if (useActionSubjectId) {
          payload = ({
            ...basePayload,
            actionSubjectId: id,
          }: GlobalItemClicked);
        } else {
          const { attributes, ...basePayloadSansAttributes } = basePayload;
          payload = {
            ...basePayloadSansAttributes,
            attributes: { ...attributes, itemId: id },
          };
        }
        const event = createAnalyticsEvent(payload);

        event.fire(navigationChannel);

        return null;
      },
    })(Component),
  );
};

export const navigationUILoaded = (
  createAnalyticsEvent: Function,
  { layer }: { layer: ViewLayer },
) =>
  createAnalyticsEvent({
    action: 'initialised',
    actionSubject: 'navigationUI',
    actionSubjectId: layer,
    eventType: 'operational',
  }).fire(navigationChannel);

export const navigationExpandedCollapsed = (
  createAnalyticsEvent: Function,
  { isCollapsed, trigger }: { isCollapsed: boolean, trigger: string },
) =>
  createAnalyticsEvent({
    action: isCollapsed ? 'collapsed' : 'expanded',
    actionSubject: 'productNavigation',
    attributes: {
      trigger,
    },
  }).fire(navigationChannel);
