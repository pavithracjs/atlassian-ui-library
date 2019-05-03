import * as Rusha from 'rusha';
import {
  sanitizeSearchQuery,
  sanitizeContainerId,
  ShownAnalyticsAttributes,
  PerformanceTiming,
  DEFAULT_GAS_CHANNEL,
  DEFAULT_GAS_ATTRIBUTES,
  DEFAULT_GAS_SOURCE,
} from './analytics-util';
import { GasPayload, EventType } from '@atlaskit/analytics-gas-types';
import { CreateAnalyticsEventFn } from '../components/analytics/types';
import { ABTest } from '../api/CrossProductSearchClient';
import { ReferralContextIdentifiers } from '../components/GlobalQuickSearchWrapper';

const fireGasEvent = (
  createAnalyticsEvent: CreateAnalyticsEventFn | undefined,
  action: string,
  actionSubject: string,
  actionSubjectId: string,
  eventType: EventType,
  extraAtrributes: object,
  nonPrivacySafeAttributes?: object | null,
): void => {
  if (createAnalyticsEvent) {
    const event = createAnalyticsEvent();
    const payload: GasPayload = {
      action,
      actionSubject,
      actionSubjectId,
      eventType,
      source: DEFAULT_GAS_SOURCE,
      attributes: {
        ...extraAtrributes,
        ...DEFAULT_GAS_ATTRIBUTES,
      },
    };
    if (nonPrivacySafeAttributes) {
      payload.nonPrivacySafeAttributes = nonPrivacySafeAttributes;
    }
    event.update(payload).fire(DEFAULT_GAS_CHANNEL);
  }
};

export function firePreQueryShownEvent(
  eventAttributes: ShownAnalyticsAttributes,
  elapsedMs: number,
  renderTimeMs: number,
  searchSessionId: string,
  createAnalyticsEvent: CreateAnalyticsEventFn,
  abTest: ABTest,
  referralContextIdentifiers?: ReferralContextIdentifiers,
  experimentRequestDurationMs?: number,
  retrievedFromAggregator?: boolean,
) {
  fireGasEvent(
    createAnalyticsEvent,
    'shown',
    'searchResults',
    'preQuerySearchResults',
    'ui',
    {
      preQueryRequestDurationMs: elapsedMs,
      experimentRequestDurationMs,
      renderTimeMs,
      searchSessionId: searchSessionId,
      referralContextIdentifiers,
      ...eventAttributes,
      retrievedFromAggregator,
      ...abTest,
    },
  );
}

export function fireExperimentExposureEvent(
  abTest: ABTest,
  searchSessionId: string,
  createAnalyticsEvent: CreateAnalyticsEventFn,
) {
  fireGasEvent(
    createAnalyticsEvent,
    'exposed',
    'quickSearchExperiment',
    '',
    'operational',
    {
      searchSessionId,
      abTest, // send nested structure for backwards compat
      ...abTest, // send destructured object for easier querying of props
    },
  );
}

const getQueryAttributes = (query: string): Object => {
  const sanitizedQuery = sanitizeSearchQuery(query);
  return {
    queryLength: sanitizedQuery.length,
    wordCount:
      sanitizedQuery.length > 0 ? sanitizedQuery.split(/\s/).length : 0,
    queryHash: sanitizedQuery ? hash(sanitizedQuery) : '',
    isNonZeroNumericQuery: !!+sanitizedQuery,
  };
};

const getNonPrivacySafeAttributes = (query: string): Object => {
  return {
    query: sanitizeSearchQuery(query),
  };
};

export function fireTextEnteredEvent(
  query: string,
  searchSessionId: string,
  queryVersion: number,
  isSendSearchTermsEnabled?: boolean,
  createAnalyticsEvent?: CreateAnalyticsEventFn,
) {
  fireGasEvent(
    createAnalyticsEvent,
    'entered',
    'text',
    'globalSearchInputBar',
    'track',
    {
      queryId: null,
      queryVersion: queryVersion,
      ...getQueryAttributes(query),
      searchSessionId: searchSessionId,
    },
    isSendSearchTermsEnabled ? getNonPrivacySafeAttributes(query) : undefined,
  );
}

export function fireDismissedEvent(
  searchSessionId: string,
  createAnalyticsEvent?: CreateAnalyticsEventFn,
) {
  fireGasEvent(
    createAnalyticsEvent,
    'dismissed',
    'globalSearchDrawer',
    '',
    'ui',
    { searchSessionId },
  );
}
export function firePostQueryShownEvent(
  resultsDetails: ShownAnalyticsAttributes,
  timings: PerformanceTiming,
  searchSessionId: string,
  query: string,
  createAnalyticsEvent: CreateAnalyticsEventFn,
  abTest: ABTest,
  referralContextIdentifiers?: ReferralContextIdentifiers,
) {
  const event = createAnalyticsEvent();

  const { elapsedMs, ...otherPerformanceTimings } = timings;
  const payload: GasPayload = {
    action: 'shown',
    actionSubject: 'searchResults',
    actionSubjectId: 'postQuerySearchResults',
    eventType: 'ui',
    source: DEFAULT_GAS_SOURCE,
    attributes: {
      ...getQueryAttributes(query),
      postQueryRequestDurationMs: elapsedMs,
      searchSessionId,
      referralContextIdentifiers,
      ...otherPerformanceTimings,
      ...resultsDetails,
      ...DEFAULT_GAS_ATTRIBUTES,
      ...abTest,
    },
  };
  event.update(payload).fire(DEFAULT_GAS_CHANNEL);
}

const transformSearchResultEventData = (eventData: SearchResultEvent) => ({
  resultContentId: eventData.resultId,
  type: eventData.contentType,
  sectionId: eventData.type,
  sectionIndex: eventData.sectionIndex,
  globalIndex: eventData.index,
  indexWithinSection: eventData.indexWithinSection,
  containerId: sanitizeContainerId(eventData.containerId),
  resultCount: eventData.resultCount,
  experimentId: eventData.experimentId,
  isRecentResult: eventData.isRecentResult,
});

const hash = (str: string): string =>
  Rusha.createHash()
    .update(str)
    .digest('hex');

export interface SearchResultEvent {
  resultId: string;
  type: string;
  contentType: string;
  sectionIndex: string;
  index: string;
  indexWithinSection: string;
  containerId?: string;
  resultCount?: string;
  experimentId?: string;
  isRecentResult?: boolean;
}

export interface KeyboardControlEvent extends SearchResultEvent {
  key: string;
}

export interface SelectedSearchResultEvent extends SearchResultEvent {
  method: string;
  newTab: boolean;
  query: string;
  queryVersion: number;
  queryId: null | string;
}

export interface AdvancedSearchSelectedEvent extends SelectedSearchResultEvent {
  wasOnNoResultsScreen: boolean;
  trigger?: string;
  isLoading: boolean;
}

export type AnalyticsNextEvent = {
  payload: GasPayload;
  context: Array<any>;
  update: (payload: GasPayload) => AnalyticsNextEvent;
  fire: (string: string) => AnalyticsNextEvent;
};

export function fireSelectedSearchResult(
  eventData: SelectedSearchResultEvent,
  searchSessionId: string,
  referralContextIdentifiers?: ReferralContextIdentifiers,
  createAnalyticsEvent?: CreateAnalyticsEventFn,
) {
  const { method, newTab, query, queryVersion } = eventData;
  fireGasEvent(
    createAnalyticsEvent,
    'selected',
    'navigationItem',
    'searchResult',
    'track',
    {
      queryVersion,
      queryId: null,
      ...getQueryAttributes(query),
      trigger: method,
      searchSessionId: searchSessionId,
      newTab,
      ...transformSearchResultEventData(eventData),
      referralContextIdentifiers,
    },
  );
}

export function fireSelectedAdvancedSearch(
  eventData: AdvancedSearchSelectedEvent,
  searchSessionId: string,
  referralContextIdentifiers?: ReferralContextIdentifiers,
  createAnalyticsEvent?: CreateAnalyticsEventFn,
) {
  const { method, newTab, query, queryVersion } = eventData;
  fireGasEvent(
    createAnalyticsEvent,
    'selected',
    'navigationItem',
    `advanced_${eventData.resultId}`,
    'track',
    {
      trigger: method,
      searchSessionId: searchSessionId,
      newTab,
      queryVersion,
      queryId: null,
      isLoading: eventData.isLoading,
      ...getQueryAttributes(query),
      wasOnNoResultsScreen: eventData.wasOnNoResultsScreen || false,
      ...transformSearchResultEventData(eventData),
      referralContextIdentifiers,
    },
  );
}

export function fireHighlightedSearchResult(
  eventData: KeyboardControlEvent,
  searchSessionId: string,
  referralContextIdentifiers?: ReferralContextIdentifiers,
  createAnalyticsEvent?: CreateAnalyticsEventFn,
) {
  const { key } = eventData;
  fireGasEvent(
    createAnalyticsEvent,
    'highlighted',
    'navigationItem',
    'searchResult',
    'ui',
    {
      searchSessionId: searchSessionId,
      ...transformSearchResultEventData(eventData),
      key,
      referralContextIdentifiers,
    },
  );
}
