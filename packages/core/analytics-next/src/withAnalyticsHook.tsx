/* This is a temporary and lazy way for me to test the hook. Will delete this and write separate tests once POC is approved. */

import React from 'react';

import { Omit } from '@atlaskit/type-helpers';
import { CreateUIAnalyticsEvent, CreateEventMap } from './types';
import { useAnalytics } from './useAnalytics';

export interface WithAnalyticsHookProps {
  /**
   * You should not be accessing this prop under any circumstances.
   * It is provided by `@atlaskit/analytics-next` and integrated in the component
   */
  createAnalyticsEvent?: CreateUIAnalyticsEvent;

  ref?: React.Ref<any>;
}

const withAnalyticsHook = (createEventMap?: CreateEventMap) => <
  Props extends WithAnalyticsHookProps,
  Component
>(
  WrappedComponent: React.JSXElementConstructor<Props> & Component,
) => {
  type WrappedProps = JSX.LibraryManagedAttributes<
    Component,
    Omit<Props, keyof WithAnalyticsHookProps>
  >;

  const WithAnalyticsHook = React.forwardRef<any, WrappedProps>(
    (props, ref) => {
      const { createAnalyticsEvent, patchedEventProps } = useAnalytics<
        WrappedProps
      >(createEventMap, props);
      return (
        <WrappedComponent
          {...props as any}
          {...patchedEventProps}
          createAnalyticsEvent={createAnalyticsEvent}
          ref={ref}
        />
      );
    },
  );

  // @ts-ignore
  WithAnalyticsHook.displayName = `WithAnalyticsHook(${WrappedComponent.displayName ||
    WrappedComponent.name})`;

  return WithAnalyticsHook;
};

export default withAnalyticsHook;
