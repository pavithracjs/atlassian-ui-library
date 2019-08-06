/**
 * Largely taken from analytics-web-react
 */

import merge from 'lodash.merge';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';

const extractFromEventContext = (
  propertyName: string,
  event: UIAnalyticsEvent,
) =>
  event.context
    .map((contextItem: any) => contextItem[propertyName])
    .filter(Boolean);

export const getActionSubject = (event: UIAnalyticsEvent) => {
  const overrides = extractFromEventContext('actionSubjectOverride', event);

  const closestContext =
    event.context.length > 0 ? event.context[event.context.length - 1] : {};

  const actionSubject = event.payload.actionSubject || closestContext.component;

  return overrides.length > 0 ? overrides[0] : actionSubject;
};

export const getSources = (event: UIAnalyticsEvent) =>
  extractFromEventContext('source', event);

export const getComponents = (event: UIAnalyticsEvent) =>
  extractFromEventContext('component', event);

export const getExtraAttributes = (event: UIAnalyticsEvent) =>
  extractFromEventContext('attributes', event).reduce(
    (result, extraAttributes) => merge(result, extraAttributes),
    {},
  );

export const getPackageInfo = (event: UIAnalyticsEvent) =>
  event.context
    .map(contextItem => ({
      packageName: contextItem.packageName,
      packageVersion: contextItem.packageVersion,
    }))
    .filter(p => p.packageName);

export const getPackageVersion = (event: UIAnalyticsEvent) =>
  extractFromEventContext('packageVersion', event);
