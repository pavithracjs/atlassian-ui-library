// @flow

import React, {
  Component,
  type Node,
  type ComponentType,
  type ElementConfig,
} from 'react';
import PropTypes from 'prop-types';

import UIAnalyticsEvent from './UIAnalyticsEvent';
import type { AnalyticsEventPayload } from './types';

export type CreateUIAnalyticsEvent = (
  payload: AnalyticsEventPayload,
) => UIAnalyticsEvent;

export type WithAnalyticsEventsProps = {|
  /**
    You should not be accessing this prop under any circumstances. It is provided by `@atlaskit/analytics-next` and integrated in the component
  */
  createAnalyticsEvent: CreateUIAnalyticsEvent,
|};

type AnalyticsEventsProps = {
  createAnalyticsEvent: CreateUIAnalyticsEvent | void,
};

type AnalyticsEventCreator<ProvidedProps: {}> = (
  create: CreateUIAnalyticsEvent,
  props: ProvidedProps,
) => ?UIAnalyticsEvent;

type EventMap<ProvidedProps: {}> = {
  [string]: AnalyticsEventPayload | AnalyticsEventCreator<ProvidedProps>,
};
type WrappedComponentProps = {};

// This component is used to grab the analytics functions off context.
// It uses legacy context, but provides an API similar to 16.3 context.
// This makes it easier to use with the forward ref API.
class AnalyticsContextConsumer extends Component<{
  children: ({
    createAnalyticsEvent: CreateUIAnalyticsEvent,
    patchedEventProps: WrappedComponentProps,
  }) => Node,
  createEventMap: EventMap<
    AnalyticsEventsWrappedProps<ComponentType<WrappedComponentProps>>,
  >,
  wrappedComponentProps: WrappedComponentProps,
}> {
  static contextTypes = {
    getAtlaskitAnalyticsEventHandlers: PropTypes.func,
    getAtlaskitAnalyticsContext: PropTypes.func,
  };

  static defaultProps = {
    createEventMap: {},
  };

  // Store references to the original and patched event props so we can determine when to update
  // the patched props
  originalEventProps: {} = {};

  patchedEventProps: {} = {};

  constructor(props) {
    super(props);
    Object.keys(this.props.createEventMap).forEach(p => {
      this.originalEventProps[p] = props.wrappedComponentProps[p];
    });
    this.patchedEventProps = this.mapCreateEventsToProps(
      Object.keys(this.props.createEventMap),
      props.wrappedComponentProps,
    );
  }

  // Update patched event props only if the original props have changed
  updatePatchedEventProps = props => {
    const changedPropCallbacks = Object.keys(this.props.createEventMap).filter(
      p => this.originalEventProps[p] !== props[p],
    );
    if (changedPropCallbacks.length > 0) {
      this.patchedEventProps = {
        ...this.patchedEventProps,
        ...this.mapCreateEventsToProps(changedPropCallbacks, props),
      };
      changedPropCallbacks.forEach(p => {
        this.originalEventProps[p] = props[p];
      });
    }

    return this.patchedEventProps;
  };

  mapCreateEventsToProps = (changedPropNames: string[], props) =>
    changedPropNames.reduce((modified, propCallbackName) => {
      const eventCreator = this.props.createEventMap[propCallbackName];
      const providedCallback = props[propCallbackName];
      if (!['object', 'function'].includes(typeof eventCreator)) {
        return modified;
      }
      const modifiedCallback = (...args) => {
        const analyticsEvent =
          typeof eventCreator === 'function'
            ? eventCreator(this.createAnalyticsEvent, props)
            : this.createAnalyticsEvent(eventCreator);

        if (providedCallback) {
          providedCallback(...args, analyticsEvent);
        }
      };
      return {
        ...modified,
        [propCallbackName]: modifiedCallback,
      };
    }, {});

  createAnalyticsEvent = (payload: AnalyticsEventPayload): UIAnalyticsEvent => {
    const {
      getAtlaskitAnalyticsEventHandlers,
      getAtlaskitAnalyticsContext,
    } = this.context;
    const context =
      (typeof getAtlaskitAnalyticsContext === 'function' &&
        getAtlaskitAnalyticsContext()) ||
      [];
    const handlers =
      (typeof getAtlaskitAnalyticsEventHandlers === 'function' &&
        getAtlaskitAnalyticsEventHandlers()) ||
      [];
    return new UIAnalyticsEvent({ context, handlers, payload });
  };

  render() {
    const patchedEventProps = this.updatePatchedEventProps(
      this.props.wrappedComponentProps,
    );

    return this.props.children({
      createAnalyticsEvent: this.createAnalyticsEvent,
      patchedEventProps,
    });
  }
}

type AnalyticsEventsWrappedProps<C> = $Diff<
  ElementConfig<$Supertype<C>>,
  AnalyticsEventsProps,
>;
export type AnalyticsEventsWrappedComp<C> = ComponentType<
  AnalyticsEventsWrappedProps<C>,
>;

export default function withAnalyticsEvents<P: {}, C: ComponentType<P>>(
  createEventMap: EventMap<AnalyticsEventsWrappedProps<C>> = {},
): C => AnalyticsEventsWrappedComp<C> {
  return WrappedComponent => {
    // $FlowFixMe - flow 0.67 doesn't know about forwardRef
    const WithAnalyticsEvents = React.forwardRef((props, ref) => (
      <AnalyticsContextConsumer
        createEventMap={createEventMap}
        wrappedComponentProps={props}
      >
        {({ createAnalyticsEvent, patchedEventProps }) => {
          return (
            <WrappedComponent
              {...props}
              {...patchedEventProps}
              createAnalyticsEvent={createAnalyticsEvent}
              ref={ref}
            />
          );
        }}
      </AnalyticsContextConsumer>
    ));

    WithAnalyticsEvents.displayName = `WithAnalyticsEvents(${WrappedComponent.displayName ||
      WrappedComponent.name})`;

    return WithAnalyticsEvents;
  };
}

export const withAnalyticsForSumTypeProps = withAnalyticsEvents;
