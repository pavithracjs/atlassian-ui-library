import { useContext, useState } from 'react';

import { AnalyticsReactContext } from './AnalyticsReactContext';
import {
  CreateEventMap,
  CreateUIAnalyticsEvent,
  AnalyticsEventCreator,
} from './types';
import UIAnalyticsEvent from './UIAnalyticsEvent';
import { AnalyticsEventPayload } from './AnalyticsEvent';

export type UseAnalyticsHook = {
  createAnalyticsEvent: CreateUIAnalyticsEvent;
  patchedEventProps: CreateEventMap;
};

export function useAnalytics<Props extends Record<string, any>>(
  createEventMap: CreateEventMap = {},
  wrappedComponentProps: Props,
): UseAnalyticsHook {
  const {
    getAtlaskitAnalyticsEventHandlers,
    getAtlaskitAnalyticsContext,
  } = useContext(AnalyticsReactContext);
  const [originalProps, setOriginalProps] = useState<CreateEventMap>({});
  const [patchedProps, setPatchedProps] = useState<CreateEventMap>({});
  const [isFirstLoop, setIsFirstLoop] = useState(true);

  const createAnalyticsEvent = (
    payload: AnalyticsEventPayload,
  ): UIAnalyticsEvent =>
    new UIAnalyticsEvent({
      context: getAtlaskitAnalyticsContext(),
      handlers: getAtlaskitAnalyticsEventHandlers(),
      payload,
    });

  const mapCreateEventsToProps = (changedPropNames: string[], props: Props) =>
    changedPropNames.reduce((modified, propCallbackName) => {
      const eventCreator = createEventMap[propCallbackName];
      const providedCallback = props[propCallbackName];

      if (!['object', 'function'].includes(typeof eventCreator)) {
        return modified;
      }

      const modifiedCallback = (...args: any[]) => {
        const analyticsEvent =
          typeof eventCreator === 'function'
            ? (eventCreator as AnalyticsEventCreator)(
                createAnalyticsEvent,
                props,
              )
            : createAnalyticsEvent(eventCreator);

        if (providedCallback) {
          providedCallback(...args, analyticsEvent);
        }
      };

      return {
        ...modified,
        [propCallbackName]: modifiedCallback,
      };
    }, {});

  const updatePatchedEventProps = (props: Props): CreateEventMap => {
    const changedPropCallbacks = Object.keys(createEventMap).filter(
      p => originalProps[p] !== props[p],
    );
    if (changedPropCallbacks.length > 0) {
      setPatchedProps({
        ...patchedProps,
        ...mapCreateEventsToProps(changedPropCallbacks, props),
      });
      const updatedProps = changedPropCallbacks.reduce(
        (a, c) => ({ ...a, [c]: props[c] }),
        {},
      );
      setOriginalProps({
        ...originalProps,
        ...updatedProps,
      });
    }

    return patchedProps;
  };

  if (isFirstLoop) {
    setOriginalProps(
      Object.keys(createEventMap).reduce(
        (a, c) => ({ ...a, [c]: wrappedComponentProps[c] }),
        {},
      ),
    );

    setPatchedProps(
      mapCreateEventsToProps(
        Object.keys(createEventMap),
        wrappedComponentProps,
      ),
    );

    setIsFirstLoop(false);
  }

  return {
    createAnalyticsEvent,
    patchedEventProps: updatePatchedEventProps(wrappedComponentProps),
  };
}
