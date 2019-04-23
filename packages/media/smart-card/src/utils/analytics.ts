import {
  name as packageName,
  version as packageVersion,
} from '../version.json';
import { CreateUIAnalyticsEventSignature } from '@atlaskit/analytics-next';
import { AnalyticsPayload } from './types.js';
export const ANALYTICS_CHANNEL = 'media';

export const context = {
  componentName: 'smart-cards',
  packageName,
  packageVersion,
};

export const fireSmartLinkEvent = (
  payload: AnalyticsPayload,
  createAnalyticsEvent?: CreateUIAnalyticsEventSignature,
) => {
  if (createAnalyticsEvent) {
    createAnalyticsEvent(payload).fire(ANALYTICS_CHANNEL);
  }
};

export const resolvedEvent = (definitionId?: string): AnalyticsPayload => ({
  action: 'resolved',
  actionSubject: 'smartLink',
  eventType: 'operational',
  attributes: {
    ...context,
    ...(definitionId ? { definitionId: definitionId } : {}),
  },
});

export const unresolvedEvent = (
  status: string,
  definitionId?: string,
): AnalyticsPayload => ({
  action: 'unresolved',
  actionSubject: 'smartLink',
  eventType: 'operational',
  attributes: {
    ...context,
    ...(definitionId ? { definitionId: definitionId } : {}),
    reason: status,
  },
});

export const connectSucceededEvent = (
  definitionId?: string,
): AnalyticsPayload => ({
  action: 'connectSucceeded',
  actionSubject: 'smartLink',
  eventType: 'operational',
  attributes: {
    ...context,
    ...(definitionId ? { definitionId: definitionId } : {}),
  },
});

export const connectFailedEvent = (
  definitionId?: string,
  reason?: string,
): AnalyticsPayload => ({
  action: 'connectFailed',
  actionSubject: 'smartLink',
  actionSubjectId: reason,
  eventType: 'operational',
  attributes: {
    ...context,
    ...(reason ? { reason: reason } : {}),
    ...(definitionId ? { definitionId: definitionId } : {}),
  },
});

export const trackAppAccountConnected = (
  definitionId?: string,
): AnalyticsPayload => ({
  action: 'connected',
  actionSubject: 'applicationAccount',
  eventType: 'track',
  attributes: {
    ...context,
    ...(definitionId ? { definitionId: definitionId } : {}),
  },
});

export const uiAuthEvent = (
  definitionId: string,
  display: 'inline' | 'block',
): AnalyticsPayload => ({
  action: 'clicked',
  actionSubject: 'button',
  actionSubjectId: 'connectAccount',
  eventType: 'ui',
  attributes: {
    ...context,
    definitionId,
    display,
  },
});

export const uiAuthAlternateAccountEvent = (
  definitionId: string,
  display: 'inline' | 'block',
): AnalyticsPayload => ({
  action: 'clicked',
  actionSubject: 'smartLink',
  actionSubjectId: 'tryAnotherAccount',
  eventType: 'ui',
  attributes: {
    ...context,
    definitionId,
    display,
  },
});

export const uiCardClickedEvent = (
  definitionId: string,
  display: 'inline' | 'block',
): AnalyticsPayload => ({
  action: 'clicked',
  actionSubject: 'smartLink',
  eventType: 'ui',
  attributes: {
    ...context,
    definitionId,
    display,
  },
});

export const uiClosedAuthEvent = (
  definitionId: string,
  display: 'inline' | 'block',
): AnalyticsPayload => ({
  action: 'closed',
  actionSubject: 'consentModal',
  eventType: 'ui',
  attributes: {
    ...context,
    definitionId,
    display,
  },
});

export const screenAuthPopupEvent = (
  definitionId: string,
): AnalyticsPayload => ({
  actionSubject: 'consentModal',
  eventType: 'screen',
  attributes: {
    ...context,
    definitionId,
  },
});
