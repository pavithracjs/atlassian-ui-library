import { auth } from '@atlaskit/outbound-auth-flow-client';

import { AnalyticsHandler } from '../../utils/types';
import {
  cardAction,
  getDefinitionId,
  getByDefinitionId,
  getServices,
  getStatus,
} from './helpers';
import {
  ACTION_PENDING,
  ACTION_RESOLVING,
  ACTION_RESOLVED,
  ACTION_ERROR,
} from './constants';
import { CardAppearance } from '../../view/Card';
import { JsonLd } from '../../client/types';
import {
  resolvedEvent,
  unresolvedEvent,
  uiAuthEvent,
  uiAuthAlternateAccountEvent,
  trackAppAccountConnected,
  connectSucceededEvent,
  connectFailedEvent,
  uiClosedAuthEvent,
  MESSAGE_WINDOW_CLOSED,
  KEY_WINDOW_CLOSED,
  KEY_SENSITIVE_DATA,
  screenAuthPopupEvent,
} from '../../utils/analytics';
import { useSmartLinkContext } from '../context';

export function useSmartCardActions(
  url: string,
  dispatchAnalytics: AnalyticsHandler,
) {
  const { store, connections, config } = useSmartLinkContext();
  const { getState, dispatch } = store;
  const { details, lastUpdatedAt, status } = getState()[url] || {
    status: 'pending',
    lastUpdatedAt: Date.now(),
    details: undefined,
  };

  function register() {
    if (!details) {
      dispatch(cardAction(ACTION_PENDING, { url }));
    }
    resolve();
  }

  function resolve(
    resourceUrl = url,
    isReloading = false,
    showLoadingSpinner = true,
  ) {
    // Trigger asynchronous call to ORS API, race between this and
    // setting the card to a loading state.
    const definitionId = getDefinitionId(details);
    const hasAuthorized = status !== 'unauthorized';
    const hasData = !!(details && details.data);
    const hasExpired = Date.now() - lastUpdatedAt >= config.maxAge;
    // 1. Wait 1.2 seconds - if the card still has not been resolved,
    // emit the loading action to provide UI feedback. Note: only show
    // UI feedback if the URL does not already have data.
    let isCompleted = false;
    if (showLoadingSpinner && (!hasAuthorized || !hasData)) {
      setTimeout(() => {
        if (!isCompleted) {
          dispatch(cardAction(ACTION_RESOLVING, { url: resourceUrl }));
        }
      }, config.maxLoadingDelay);
    }
    // 2. Request JSON-LD data for the card from ORS, iff it has extended
    // its cache lifespan OR there is no data for it currently. Once the data
    // has come back asynchronously, dispatch the resolved action for the card.
    if (isReloading || hasExpired || !hasData) {
      connections.client
        .fetchData(resourceUrl)
        .then((response: JsonLd) => {
          isCompleted = true;
          const nextDefinitionId = getDefinitionId(response);
          const nextStatus = getStatus(response);
          if (nextStatus === 'resolved') {
            dispatchAnalytics(resolvedEvent(nextDefinitionId));
          } else {
            dispatchAnalytics(unresolvedEvent(nextStatus, nextDefinitionId));
          }
          dispatch(cardAction(ACTION_RESOLVED, { url: resourceUrl }, response));
        })
        .catch((error: any) => {
          isCompleted = true;
          dispatch(cardAction(ACTION_ERROR, { url: resourceUrl }, error));
        });
    } else {
      dispatchAnalytics(resolvedEvent(definitionId));
      isCompleted = true;
    }
  }

  function reload(showLoadingSpinner = false) {
    const definitionId = getDefinitionId(details);
    getByDefinitionId(definitionId, getState()).map(url =>
      resolve(url, true, showLoadingSpinner),
    );
  }

  function authorize(appearance: CardAppearance) {
    const definitionId = getDefinitionId(details);
    const services = getServices(details);
    // When authentication is triggered, let GAS know!
    if (status === 'unauthorized') {
      dispatchAnalytics(uiAuthEvent(appearance, definitionId));
    }
    if (status === 'forbidden') {
      dispatchAnalytics(uiAuthAlternateAccountEvent(appearance, definitionId));
    }
    if (services.length > 0) {
      dispatchAnalytics(screenAuthPopupEvent(definitionId));
      auth(services[0].url).then(
        () => {
          dispatchAnalytics(trackAppAccountConnected(definitionId));
          dispatchAnalytics(connectSucceededEvent(definitionId));
          reload();
        },
        (err: Error) => {
          if (err.message === MESSAGE_WINDOW_CLOSED) {
            dispatchAnalytics(
              connectFailedEvent(definitionId, KEY_WINDOW_CLOSED),
            );
            dispatchAnalytics(uiClosedAuthEvent(appearance, definitionId));
          } else {
            dispatchAnalytics(
              connectFailedEvent(definitionId, KEY_SENSITIVE_DATA),
            );
          }
          reload();
        },
      );
    }
  }

  return { register, reload, authorize };
}
