declare module '@atlaskit/analytics-next' {
  import * as React from 'react';
  import { SumPropsInjector } from '@atlaskit/type-helpers';

  /*
    UIAnalyticsEvent.js
  */
  export class UIAnalyticsEvent implements UIAnalyticsEventInterface {
    constructor(payload: UIAnalyticsEventProps);

    context: Array<ObjectType>;
    handlers?: Array<UIAnalyticsEventHandlerSignature>;
    hasFired: boolean;
    payload: AnalyticsEventPayload;

    clone: () => UIAnalyticsEventInterface | null;

    fire(channel?: ChannelIdentifier): void;

    update(updater: AnalyticsEventUpdater): UIAnalyticsEventInterface;
  }

  // See remark on classes above

  /*
    types.js
  */

  // Utils

  // That replaces {} in flow types
  export type ObjectType = { [key: string]: any };

  // Basic events
  export type AnalyticsEventPayload = {
    [key: string]: any;
  };

  export type AnalyticsEventUpdater =
    | ObjectType
    | ((payload: AnalyticsEventPayload) => AnalyticsEventPayload);

  export type AnalyticsEventProps = {
    payload: AnalyticsEventPayload;
  };

  export interface AnalyticsEventInterface {
    payload: AnalyticsEventPayload;

    clone: () => AnalyticsEventInterface;

    update(updater: AnalyticsEventUpdater): AnalyticsEventInterface;
  }

  export type ChannelIdentifier = string;

  // It's called UIAnalyticsEventHandler in flow
  export interface UIAnalyticsEventHandlerSignature {
    (event: UIAnalyticsEventInterface, channel?: ChannelIdentifier): void;
  }

  export type UIAnalyticsEventProps = AnalyticsEventProps & {
    context?: Array<ObjectType>;
    handlers?: Array<UIAnalyticsEventHandlerSignature>;
  };

  // Called UIAnalyticsEvent in flow
  export interface UIAnalyticsEventInterface {
    context: Array<ObjectType>;
    handlers?: Array<UIAnalyticsEventHandlerSignature>;
    hasFired: boolean;
    payload: AnalyticsEventPayload;

    clone: () => UIAnalyticsEventInterface | null;

    fire(channel?: ChannelIdentifier): void;

    update(updater: AnalyticsEventUpdater): UIAnalyticsEventInterface;
  }

  /*
    AnalyticsEvent.js
  */
  export class AnalyticsEvent implements AnalyticsEventInterface {
    payload: AnalyticsEventPayload;

    clone: () => AnalyticsEventInterface;

    update(updater: AnalyticsEventUpdater): AnalyticsEventInterface;
  }

  /*
    AnalyticsListener.js
  */
  export interface AnalyticsListenerProps {
    children?: React.ReactNode;
    channel?: string;
    onEvent: (event: UIAnalyticsEventInterface, channel?: string) => void;
  }

  export class AnalyticsListener extends React.Component<
    AnalyticsListenerProps
  > {}

  /*
    AnalyticsContext.js
  */
  export interface AnalyticsContextProps {
    children: React.ReactNode;
    data: ObjectType;
  }

  export class AnalyticsContext extends React.Component<
    AnalyticsContextProps
  > {}

  type AnalyticsHOC<Props, AppliedProps> = (
    Component: React.ComponentType<Props>,
  ) => React.ComponentType<
    Pick<Props, Exclude<keyof Props, keyof AppliedProps>> & AppliedProps
  >;

  /*
    withAnalyticsContext.js
  */
  export type WithAnalyticsContextProps = {
    analyticsContext?: ObjectType;
  };

  export type WithAnalyticsContextFunction<OwnProps> = AnalyticsHOC<
    OwnProps,
    WithAnalyticsContextProps
  >;

  export function withAnalyticsContext<OwnProps>(
    defaultData?: any,
  ): WithAnalyticsContextFunction<OwnProps>;

  /*
    withAnalyticsEvents.js
  */
  export type CreateUIAnalyticsEventSignature = (
    payload: AnalyticsEventPayload,
  ) => UIAnalyticsEventInterface;

  interface AnalyticsEventCreator<OwnProps> {
    (
      create: CreateUIAnalyticsEventSignature,
      props: OwnProps,
    ): UIAnalyticsEventInterface;
  }

  export interface EventMap<OwnProps> {
    [k: string]: AnalyticsEventPayload | AnalyticsEventCreator<OwnProps>;
  }

  export interface WithAnalyticsEventProps {
    createAnalyticsEvent?: CreateUIAnalyticsEventSignature;
  }

  export type WithAnalyticsEventFunction<OwnProps> = AnalyticsHOC<
    OwnProps,
    WithAnalyticsEventProps
  >;

  export function withAnalyticsEvents<OwnProps>(
    createEventMap?: EventMap<OwnProps>,
  ): WithAnalyticsEventFunction<OwnProps>;

  // Just in case your props are of Sum type, and not a Record.
  export function withAnalyticsForSumTypeProps<OwnProps>(
    createEventMap?: EventMap<OwnProps>,
  ): SumPropsInjector<WithAnalyticsEventProps>;

  /*
    createAndFireEvent.js
  */

  export type CreateAndFireEventFunction = (
    payload: AnalyticsEventPayload,
  ) => (
    createAnalyticsEvent: CreateUIAnalyticsEventSignature,
  ) => UIAnalyticsEventInterface;

  export function createAndFireEvent(
    channel?: string,
  ): CreateAndFireEventFunction;

  /*
    cleanProps.js
  */
  export function cleanProps(props: ObjectType): ObjectType;

  /**
   * AnalyticsErrorBoundary
   */

  export type AnalyticsErrorBoundaryProps = {
    children: React.ReactNode;
    data: ObjectType;
    channel: string;
  };
  export class AnalyticsErrorBoundary extends React.Component<
    AnalyticsErrorBoundaryProps
  > {}
}
