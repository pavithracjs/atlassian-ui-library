import * as React from 'react';
import {
  injectIntl,
  InjectedIntlProps,
  FormattedHTMLMessage,
} from 'react-intl';
import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme';
import { withAnalytics } from '@atlaskit/analytics';
import { withAnalyticsEvents } from '@atlaskit/analytics-next';
import { CancelableEvent } from '@atlaskit/quick-search';
import StickyFooter from '../common/StickyFooter';
import { CreateAnalyticsEventFn } from '../analytics/types';
import { SearchScreenCounter } from '../../util/ScreenCounter';
import { JiraClient } from '../../api/JiraClient';
import { PeopleSearchClient } from '../../api/PeopleSearchClient';
import { Scope } from '../../api/types';
import {
  LinkComponent,
  ReferralContextIdentifiers,
  Logger,
  JiraApplicationPermission,
} from '../GlobalQuickSearchWrapper';
import QuickSearchContainer, {
  SearchResultProps,
} from '../common/QuickSearchContainer';
import { messages } from '../../messages';
import SearchResultsComponent from '../common/SearchResults';
import NoResultsState from './NoResultsState';
import JiraAdvancedSearch from './JiraAdvancedSearch';
import {
  mapRecentResultsToUIGroups,
  mapSearchResultsToUIGroups,
} from './JiraSearchResultsMapper';
import {
  handlePromiseError,
  JiraEntityTypes,
  redirectToJiraAdvancedSearch,
  ADVANCED_JIRA_SEARCH_RESULT_ID,
} from '../SearchResultsUtil';
import {
  ContentType,
  JiraResult,
  Result,
  ResultsWithTiming,
  GenericResultMap,
  JiraResultsMap,
  AnalyticsType,
} from '../../model/Result';
import { getUniqueResultId } from '../ResultList';
import {
  CrossProductSearchClient,
  CrossProductSearchResults,
  ABTest,
} from '../../api/CrossProductSearchClient';
import performanceNow from '../../util/performance-now';
import {
  fireSelectedAdvancedSearch,
  AdvancedSearchSelectedEvent,
} from '../../util/analytics-event-helper';
import AdvancedIssueSearchLink from './AdvancedIssueSearchLink';

const JIRA_RESULT_LIMIT = 6;

const NoResultsAdvancedSearchContainer = styled.div`
  margin-top: ${4 * gridSize()}px;
`;

const BeforePreQueryStateContainer = styled.div`
  margin-top: ${gridSize()}px;
`;

export interface Props {
  createAnalyticsEvent?: CreateAnalyticsEventFn;
  linkComponent?: LinkComponent;
  referralContextIdentifiers?: ReferralContextIdentifiers;
  jiraClient: JiraClient;
  peopleSearchClient: PeopleSearchClient;
  crossProductSearchClient: CrossProductSearchClient;
  disableJiraPreQueryPeopleSearch?: boolean;
  logger: Logger;
  enablePreQueryFromAggregator?: boolean;
  onAdvancedSearch?: (
    e: CancelableEvent,
    entity: string,
    query: string,
    searchSessionId: string,
  ) => void;
  appPermission?: JiraApplicationPermission;
}

const contentTypeToSection = {
  [ContentType.JiraIssue]: 'issues',
  [ContentType.JiraBoard]: 'boards',
  [ContentType.JiraFilter]: 'filters',
  [ContentType.JiraProject]: 'projects',
};

const SCOPES = [Scope.JiraIssue, Scope.JiraBoardProjectFilter];

export interface State {
  selectedAdvancedSearchType: JiraEntityTypes;
  selectedResultId?: string;
}

const LOGGER_NAME = 'AK.GlobalSearch.JiraQuickSearchContainer';

/**
 * Container/Stateful Component that handles the data fetching and state handling when the user interacts with Search.
 */
export class JiraQuickSearchContainer extends React.Component<
  Props & InjectedIntlProps,
  State
> {
  state: State = {
    selectedAdvancedSearchType: JiraEntityTypes.Issues,
  };

  screenCounters = {
    preQueryScreenCounter: new SearchScreenCounter(),
    postQueryScreenCounter: new SearchScreenCounter(),
  };

  handleSearchSubmit = (
    event: React.KeyboardEvent<HTMLInputElement>,
    searchSessionId: string,
  ) => {
    const { onAdvancedSearch = () => {} } = this.props;
    const target = event.target as HTMLInputElement;
    const query = target.value;
    let defaultPrevented = false;

    onAdvancedSearch(
      Object.assign({}, event, {
        preventDefault() {
          defaultPrevented = true;
          event.preventDefault();
          event.stopPropagation();
        },
        stopPropagation() {},
      }),
      this.state.selectedAdvancedSearchType,
      query,
      searchSessionId,
    );

    if (!defaultPrevented) {
      redirectToJiraAdvancedSearch(
        this.state.selectedAdvancedSearchType,
        query,
      );
    }
  };

  handleAdvancedSearch = (
    event: CancelableEvent,
    entity: string,
    query: string,
    searchSessionId: string,
    analyticsData: Object,
    isLoading: boolean,
  ) => {
    const {
      referralContextIdentifiers,
      onAdvancedSearch = () => {},
    } = this.props;
    const eventData = {
      resultId: ADVANCED_JIRA_SEARCH_RESULT_ID,
      ...analyticsData,
      query,
      // queryversion is missing
      contentType: entity,
      type: AnalyticsType.AdvancedSearchJira,
      isLoading,
    } as AdvancedSearchSelectedEvent;

    fireSelectedAdvancedSearch(
      eventData,
      searchSessionId,
      referralContextIdentifiers,
      this.props.createAnalyticsEvent,
    );
    onAdvancedSearch(event, entity, query, searchSessionId);
  };

  getPreQueryDisplayedResults = (
    recentItems: GenericResultMap | null,
    _: ABTest,
    searchSessionId: string,
  ) =>
    mapRecentResultsToUIGroups(
      recentItems as JiraResultsMap,
      searchSessionId,
      this.props.appPermission,
    );

  getPostQueryDisplayedResults = (
    searchResults: GenericResultMap | null,
    query: string,
  ) =>
    mapSearchResultsToUIGroups(
      searchResults as JiraResultsMap,
      this.props.appPermission,
      query,
    );

  getSearchResultsComponent = ({
    retrySearch,
    latestSearchQuery,
    isError,
    searchResults,
    isLoading,
    recentItems,
    keepPreQueryState,
    searchSessionId,
    abTest,
  }: SearchResultProps) => {
    const query = latestSearchQuery;
    const {
      referralContextIdentifiers,
      onAdvancedSearch = () => {},
      appPermission,
    } = this.props;

    return (
      <SearchResultsComponent
        isPreQuery={!query}
        isError={isError}
        isLoading={isLoading}
        retrySearch={retrySearch}
        keepPreQueryState={keepPreQueryState}
        searchSessionId={searchSessionId}
        {...this.screenCounters}
        referralContextIdentifiers={referralContextIdentifiers}
        renderNoRecentActivity={() => (
          <>
            <FormattedHTMLMessage {...messages.jira_no_recent_activity_body} />
            <NoResultsAdvancedSearchContainer>
              <JiraAdvancedSearch
                appPermission={appPermission}
                query={query}
                analyticsData={{ resultsCount: 0, wasOnNoResultsScreen: true }}
                onClick={(mouseEvent, entity) =>
                  this.handleAdvancedSearch(
                    mouseEvent,
                    entity,
                    query,
                    searchSessionId,
                    { resultsCount: 0, wasOnNoResultsScreen: true },
                    isLoading,
                  )
                }
              />
            </NoResultsAdvancedSearchContainer>
          </>
        )}
        renderAdvancedSearchGroup={(analyticsData?) => (
          <StickyFooter style={{ marginTop: `${2 * gridSize()}px` }}>
            <JiraAdvancedSearch
              appPermission={appPermission}
              analyticsData={analyticsData}
              query={query}
              onClick={(mouseEvent, entity) =>
                this.handleAdvancedSearch(
                  mouseEvent,
                  entity,
                  query,
                  searchSessionId,
                  analyticsData,
                  isLoading,
                )
              }
            />
          </StickyFooter>
        )}
        renderBeforePreQueryState={() => (
          <BeforePreQueryStateContainer>
            <AdvancedIssueSearchLink
              onClick={({ event }) =>
                onAdvancedSearch(
                  event,
                  JiraEntityTypes.Issues,
                  query,
                  searchSessionId,
                )
              }
            />
          </BeforePreQueryStateContainer>
        )}
        getPreQueryGroups={() =>
          this.getPreQueryDisplayedResults(recentItems, abTest, searchSessionId)
        }
        getPostQueryGroups={() =>
          this.getPostQueryDisplayedResults(searchResults, query)
        }
        renderNoResult={() => (
          <NoResultsState
            query={query}
            onAdvancedSearch={(mouseEvent, entity) =>
              this.handleAdvancedSearch(
                mouseEvent,
                entity,
                query,
                searchSessionId,
                { resultsCount: 0, wasOnNoResultsScreen: true },
                isLoading,
              )
            }
          />
        )}
      />
    );
  };

  getRecentlyInteractedPeople = (): Promise<Result[]> => {
    /*
      the following code is temporarily feature flagged for performance reasons and will be shortly reinstated.
      https://product-fabric.atlassian.net/browse/QS-459
    */
    if (this.props.disableJiraPreQueryPeopleSearch) {
      return Promise.resolve([]);
    } else {
      const peoplePromise: Promise<
        Result[]
      > = this.props.peopleSearchClient.getRecentPeople();
      return handlePromiseError<Result[]>(
        peoplePromise,
        [] as Result[],
        error =>
          this.props.logger.safeError(
            LOGGER_NAME,
            'error in recently interacted people promise',
            error,
          ),
      ) as Promise<Result[]>;
    }
  };

  getRecentItemsFromJira = (sessionId: string): Promise<GenericResultMap> => {
    return this.props.jiraClient
      .getRecentItems(sessionId)
      .then(items =>
        items.reduce<GenericResultMap<JiraResult>>((acc, item) => {
          if (item.contentType) {
            const section =
              contentTypeToSection[
                item.contentType as keyof typeof contentTypeToSection
              ];
            acc[section] = ([] as JiraResult[]).concat(
              acc[section] || [],
              item,
            );
          }
          return acc;
        }, {}),
      )
      .then(({ issues = [], boards = [], projects = [], filters = [] }) => ({
        objects: issues,
        containers: [...boards, ...projects, ...filters],
      }));
  };

  getRecentItemsFromXpsearch = (
    sessionId: string,
  ): Promise<GenericResultMap> => {
    return this.props.crossProductSearchClient
      .search(
        '',
        sessionId,
        SCOPES,
        'jira',
        null,
        null,
        this.props.referralContextIdentifiers,
      )
      .then(xpRecentResults => ({
        objects: xpRecentResults.results.get(Scope.JiraIssue) || [],
        containers:
          xpRecentResults.results.get(Scope.JiraBoardProjectFilter) || [],
      }));
  };

  getJiraRecentItems = (sessionId: string): Promise<GenericResultMap> => {
    const recentItemsPromise = this.props.enablePreQueryFromAggregator
      ? this.getRecentItemsFromXpsearch(sessionId)
      : this.getRecentItemsFromJira(sessionId);
    return handlePromiseError(
      recentItemsPromise,
      {
        objects: [],
        containers: [],
      },
      error =>
        this.props.logger.safeError(
          LOGGER_NAME,
          'error in recent Jira items promise',
          error,
        ),
    );
  };

  getAbTestData = (sessionId: string): Promise<ABTest> => {
    return this.props.crossProductSearchClient.getAbTestData(Scope.JiraIssue);
  };

  canSearchUsers = (): Promise<boolean> => {
    /*
      the following code is temporarily feature flagged for performance reasons and will be shortly reinstated.
      https://product-fabric.atlassian.net/browse/QS-459
    */
    if (this.props.disableJiraPreQueryPeopleSearch) {
      return Promise.resolve(false);
    } else {
      return handlePromiseError(
        this.props.jiraClient.canSearchUsers(),
        false,
        error =>
          this.props.logger.safeError(
            LOGGER_NAME,
            'error fetching browse user permission',
            error,
          ),
      );
    }
  };

  getRecentItems = (sessionId: string): Promise<ResultsWithTiming> => {
    return Promise.all([
      this.getJiraRecentItems(sessionId),
      this.getRecentlyInteractedPeople(),
      this.canSearchUsers(),
    ])
      .then(([jiraItems, people, canSearchUsers]) => {
        return { ...jiraItems, people: canSearchUsers ? people : [] };
      })
      .then(results => ({ results } as ResultsWithTiming));
  };

  getSearchResults = (
    query: string,
    sessionId: string,
    startTime: number,
    queryVersion: number,
  ): Promise<ResultsWithTiming> => {
    const crossProductSearchPromise = this.props.crossProductSearchClient.search(
      query,
      sessionId,
      SCOPES,
      'jira',
      queryVersion,
      JIRA_RESULT_LIMIT,
      this.props.referralContextIdentifiers,
    );

    const searchPeoplePromise = Promise.resolve([] as Result[]);

    const mapPromiseToPerformanceTime = (p: Promise<any>) =>
      p.then(() => performanceNow() - startTime);

    return Promise.all<
      CrossProductSearchResults,
      Result[],
      number,
      number,
      boolean
    >([
      crossProductSearchPromise,
      searchPeoplePromise,
      mapPromiseToPerformanceTime(crossProductSearchPromise),
      mapPromiseToPerformanceTime(searchPeoplePromise),
      this.canSearchUsers(),
    ]).then(
      ([
        xpsearchResults,
        peopleResults,
        crossProductSearchElapsedMs,
        peopleElapsedMs,
        canSearchPeople,
      ]) => {
        this.highlightMatchingFirstResult(query, xpsearchResults.results.get(
          Scope.JiraIssue,
        ) as JiraResult[]);
        return {
          results: {
            objects: xpsearchResults.results.get(Scope.JiraIssue) || [],
            containers:
              xpsearchResults.results.get(Scope.JiraBoardProjectFilter) || [],
            people: canSearchPeople ? peopleResults : [],
          },
          timings: {
            crossProductSearchElapsedMs,
            peopleElapsedMs,
          },
          abTest: xpsearchResults.abTest,
        };
      },
    );
  };

  highlightMatchingFirstResult(query: string, issueResults: JiraResult[]) {
    if (
      issueResults &&
      issueResults.length > 0 &&
      typeof issueResults[0].objectKey === 'string' &&
      (issueResults[0].objectKey!.toLowerCase() === query.toLowerCase() ||
        (!!+query &&
          issueResults[0].objectKey!.toLowerCase().endsWith(`${-query}`)))
    ) {
      this.setState({
        selectedResultId: getUniqueResultId(issueResults[0]),
      });
    }
  }

  handleSelectedResultIdChanged(newSelectedId?: string) {
    this.setState({
      selectedResultId: newSelectedId,
    });
  }

  render() {
    const {
      linkComponent,
      createAnalyticsEvent,
      logger,
      enablePreQueryFromAggregator,
      referralContextIdentifiers,
    } = this.props;
    const { selectedResultId } = this.state;

    return (
      <QuickSearchContainer
        placeholder={this.props.intl.formatMessage(
          messages.jira_search_placeholder,
        )}
        linkComponent={linkComponent}
        getPreQueryDisplayedResults={this.getPreQueryDisplayedResults}
        getPostQueryDisplayedResults={this.getPostQueryDisplayedResults}
        getSearchResultsComponent={this.getSearchResultsComponent}
        getRecentItems={this.getRecentItems}
        getSearchResults={this.getSearchResults}
        getAbTestData={this.getAbTestData}
        handleSearchSubmit={this.handleSearchSubmit}
        createAnalyticsEvent={createAnalyticsEvent}
        logger={logger}
        selectedResultId={selectedResultId}
        onSelectedResultIdChanged={(newId: any) =>
          this.handleSelectedResultIdChanged(newId)
        }
        enablePreQueryFromAggregator={enablePreQueryFromAggregator}
        referralContextIdentifiers={referralContextIdentifiers}
      />
    );
  }
}

const JiraQuickSearchContainerWithIntl = injectIntl<Props>(
  withAnalytics(JiraQuickSearchContainer, {}, {}),
);

export default withAnalyticsEvents()(JiraQuickSearchContainerWithIntl);
