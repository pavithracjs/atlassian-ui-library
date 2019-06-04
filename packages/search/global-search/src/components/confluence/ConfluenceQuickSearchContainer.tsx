import * as React from 'react';
import {
  injectIntl,
  InjectedIntlProps,
  FormattedHTMLMessage,
} from 'react-intl';
import { withAnalytics, FireAnalyticsEvent } from '@atlaskit/analytics';
import { CancelableEvent } from '@atlaskit/quick-search';
import { ConfluenceClient } from '../../api/ConfluenceClient';
import {
  CrossProductSearchClient,
  CrossProductSearchResults,
  EMPTY_CROSS_PRODUCT_SEARCH_RESPONSE,
  ABTest,
} from '../../api/CrossProductSearchClient';
import { Scope, ConfluenceModelContext } from '../../api/types';
import {
  Result,
  ResultsWithTiming,
  GenericResultMap,
  ConfluenceResultsMap,
} from '../../model/Result';
import { PeopleSearchClient } from '../../api/PeopleSearchClient';
import { SearchScreenCounter } from '../../util/ScreenCounter';
import {
  LinkComponent,
  ReferralContextIdentifiers,
  Logger,
} from '../GlobalQuickSearchWrapper';
import {
  ConfluenceAdvancedSearchTypes,
  redirectToConfluenceAdvancedSearch,
  handlePromiseError,
} from '../SearchResultsUtil';
import { CreateAnalyticsEventFn } from '../analytics/types';
import performanceNow from '../../util/performance-now';
import QuickSearchContainer, {
  SearchResultProps,
} from '../common/QuickSearchContainer';
import { messages } from '../../messages';
import NoResultsState from './NoResultsState';
import SearchResultsComponent from '../common/SearchResults';
import { getConfluenceAdvancedSearchLink } from '../SearchResultsUtil';
import AdvancedSearchGroup from './AdvancedSearchGroup';
import {
  mapRecentResultsToUIGroups,
  mapSearchResultsToUIGroups,
  MAX_RECENT_RESULTS_TO_SHOW,
} from './ConfluenceSearchResultsMapper';
import { appendListWithoutDuplication } from '../../util/search-results-utils';
import { buildConfluenceModelParams } from '../../util/model-parameters';
import { ConfluenceFeatures } from '../../util/features';

/**
 * NOTE: This component is only consumed internally as such avoid using optional props
 * i.e. instead of "propX?: something" use "propX: something | undefined"
 *
 * This improves type safety and prevent us from accidentally forgetting a parameter.
 */
export interface Props {
  crossProductSearchClient: CrossProductSearchClient;
  peopleSearchClient: PeopleSearchClient;
  confluenceClient: ConfluenceClient;
  firePrivateAnalyticsEvent: FireAnalyticsEvent | undefined;
  linkComponent: LinkComponent | undefined;
  createAnalyticsEvent: CreateAnalyticsEventFn | undefined;
  referralContextIdentifiers: ReferralContextIdentifiers | undefined;
  logger: Logger;
  modelContext: ConfluenceModelContext | undefined;
  onAdvancedSearch:
    | undefined
    | ((
        e: CancelableEvent,
        entity: string,
        query: string,
        searchSessionId: string,
      ) => void);
  inputControls: JSX.Element | undefined;
  features: ConfluenceFeatures;
}

const getRecentItemMatches = (
  query: string,
  recentItems: GenericResultMap,
): Result[] => {
  return recentItems.objects
    .filter(result => {
      return result.name.toLowerCase().indexOf(query.toLowerCase()) > -1;
    })
    .slice(0, MAX_RECENT_RESULTS_TO_SHOW);
};

const mergeSearchResultsWithRecentItems = (
  searchResults: ConfluenceResultsMap,
  recentItems: Result[],
): ConfluenceResultsMap => {
  const defaultSearchResults = {
    objects: [],
    spaces: [],
    people: [],
  };

  const results = { ...defaultSearchResults, ...searchResults };

  return {
    objects: appendListWithoutDuplication(recentItems, results.objects),
    spaces: results.spaces,
    people: results.people,
  };
};

const LOGGER_NAME = 'AK.GlobalSearch.ConfluenceQuickSearchContainer';
/**
 * Container Component that handles the data fetching when the user interacts with Search.
 */
export class ConfluenceQuickSearchContainer extends React.Component<
  Props & InjectedIntlProps
> {
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
      ConfluenceAdvancedSearchTypes.Content,
      query,
      searchSessionId,
    );

    if (!defaultPrevented) {
      redirectToConfluenceAdvancedSearch(query);
    }
  };

  async searchCrossProductConfluence(
    query: string,
    sessionId: string,
    queryVersion: number,
  ): Promise<CrossProductSearchResults> {
    const { crossProductSearchClient, modelContext } = this.props;

    let scopes = [Scope.ConfluencePageBlogAttachment, Scope.ConfluenceSpace];

    scopes.push(Scope.People);

    const modelParams = buildConfluenceModelParams(
      queryVersion,
      modelContext || {},
    );

    const results = await crossProductSearchClient.search(
      query,
      sessionId,
      scopes,
      modelParams,
    );

    return results;
  }

  // TODO extract
  handleSearchErrorAnalytics(error: Error, source: string): void {
    const { firePrivateAnalyticsEvent } = this.props;
    if (firePrivateAnalyticsEvent) {
      try {
        firePrivateAnalyticsEvent(
          'atlassian.fabric.global-search.search-error',
          {
            name: error.name,
            message: error.message,
            source: source,
          },
        );
      } catch (e) {
        this.props.logger.safeError(
          LOGGER_NAME,
          'Can not fire event atlassian.fabric.global-search.search-error',
          e,
        );
      }
    }
  }

  handleSearchErrorAnalyticsThunk = (
    source: string,
  ): ((reason: any) => void) => error => {
    this.handleSearchErrorAnalytics(error, source);
    this.props.logger.safeError(
      LOGGER_NAME,
      `error in promise ${source}`,
      error,
    );
  };

  getSearchResults = (
    query: string,
    sessionId: string,
    startTime: number,
    queryVersion: number,
  ): Promise<ResultsWithTiming> => {
    const confXpSearchPromise = handlePromiseError(
      this.searchCrossProductConfluence(query, sessionId, queryVersion),
      EMPTY_CROSS_PRODUCT_SEARCH_RESPONSE,
      this.handleSearchErrorAnalyticsThunk('xpsearch-confluence'),
    );

    const mapPromiseToPerformanceTime = (p: Promise<any>) =>
      p.then(() => performanceNow() - startTime);

    return Promise.all<CrossProductSearchResults, number>([
      confXpSearchPromise,
      mapPromiseToPerformanceTime(confXpSearchPromise),
    ]).then(([xpsearchResults, confSearchElapsedMs]) => ({
      results: {
        objects:
          xpsearchResults.results.get(Scope.ConfluencePageBlogAttachment) || [],
        spaces: xpsearchResults.results.get(Scope.ConfluenceSpace) || [],
        people: xpsearchResults.results.get(Scope.People) || [],
      },
      timings: {
        confSearchElapsedMs,
      },
    }));
  };

  getAbTestData = (sessionId: string): Promise<ABTest> => {
    return this.props.crossProductSearchClient.getAbTestData(
      Scope.ConfluencePageBlogAttachment,
    );
  };

  getRecentPeople = (sessionId: string): Promise<Result[]> => {
    const {
      peopleSearchClient,
      crossProductSearchClient,
      features,
    } = this.props;

    // We want to be consistent with the search results when prefetching is enabled so we will use URS (via aggregator) to get the
    // bootstrapped people results, see prefetchResults.ts.
    return !features.useUrsForBootstrapping
      ? peopleSearchClient.getRecentPeople()
      : crossProductSearchClient
          .getPeople('', sessionId, 'confluence', 3)
          .then(
            xProductResult =>
              xProductResult.results.get(Scope.UserConfluence) || [],
          );
  };

  getRecentItems = (sessionId: string): Promise<ResultsWithTiming> => {
    const { confluenceClient } = this.props;

    const recentActivityPromisesMap = {
      'recent-confluence-items': confluenceClient.getRecentItems(sessionId),
      'recent-confluence-spaces': confluenceClient.getRecentSpaces(sessionId),
      'recent-people': this.getRecentPeople(sessionId),
    };

    const recentActivityPromises: Promise<Result[]>[] = (Object.keys(
      recentActivityPromisesMap,
    ) as Array<keyof typeof recentActivityPromisesMap>).map(key =>
      handlePromiseError(
        recentActivityPromisesMap[key],
        [],
        this.handleSearchErrorAnalyticsThunk(key),
      ),
    );

    return Promise.all(recentActivityPromises).then(
      ([
        recentlyViewedPages,
        recentlyViewedSpaces,
        recentlyInteractedPeople,
      ]) => ({
        results: {
          objects: recentlyViewedPages,
          spaces: recentlyViewedSpaces,
          people: recentlyInteractedPeople,
        },
      }),
    );
  };

  getPreQueryDisplayedResults = (
    recentItems: ConfluenceResultsMap,
    abTest: ABTest,
    searchSessionId: string,
  ) => mapRecentResultsToUIGroups(recentItems, abTest, searchSessionId);

  getPostQueryDisplayedResults = (
    searchResults: ConfluenceResultsMap,
    latestSearchQuery: string,
    recentItems: ConfluenceResultsMap,
    abTest: ABTest,
    isLoading: boolean,
    searchSessionId: string,
  ) => {
    const { features } = this.props;
    if (features.isInFasterSearchExperiment) {
      const currentSearchResults: ConfluenceResultsMap = isLoading
        ? ({} as ConfluenceResultsMap)
        : (searchResults as ConfluenceResultsMap);

      const recentResults = getRecentItemMatches(
        latestSearchQuery,
        recentItems as ConfluenceResultsMap,
      );
      const mergedRecentSearchResults = mergeSearchResultsWithRecentItems(
        currentSearchResults,
        recentResults,
      );

      return mapSearchResultsToUIGroups(
        mergedRecentSearchResults,
        abTest,
        searchSessionId,
      );
    } else {
      return mapSearchResultsToUIGroups(
        searchResults as ConfluenceResultsMap,
        abTest,
        searchSessionId,
      );
    }
  };

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
    const { onAdvancedSearch = () => {}, features } = this.props;

    return (
      <SearchResultsComponent
        isPreQuery={!latestSearchQuery}
        isError={isError}
        isLoading={isLoading}
        retrySearch={retrySearch}
        keepPreQueryState={
          features.isInFasterSearchExperiment ? false : keepPreQueryState
        }
        searchSessionId={searchSessionId}
        {...this.screenCounters}
        referralContextIdentifiers={this.props.referralContextIdentifiers}
        renderNoRecentActivity={() => (
          <FormattedHTMLMessage
            {...messages.no_recent_activity_body}
            values={{ url: getConfluenceAdvancedSearchLink() }}
          />
        )}
        renderAdvancedSearchGroup={(analyticsData?) => (
          <AdvancedSearchGroup
            key="advanced"
            query={latestSearchQuery}
            analyticsData={analyticsData}
            onClick={(event, entity) =>
              onAdvancedSearch(
                event,
                entity,
                latestSearchQuery,
                searchSessionId,
              )
            }
          />
        )}
        getPreQueryGroups={() =>
          this.getPreQueryDisplayedResults(
            recentItems as ConfluenceResultsMap,
            abTest,
            searchSessionId,
          )
        }
        getPostQueryGroups={() =>
          this.getPostQueryDisplayedResults(
            searchResults as ConfluenceResultsMap,
            latestSearchQuery,
            recentItems as ConfluenceResultsMap,
            abTest,
            isLoading,
            searchSessionId,
          )
        }
        renderNoResult={() => (
          <NoResultsState
            query={latestSearchQuery}
            onClick={(event, entity) =>
              onAdvancedSearch(
                event,
                entity,
                latestSearchQuery,
                searchSessionId,
              )
            }
          />
        )}
      />
    );
  };

  render() {
    const { linkComponent, logger, inputControls } = this.props;

    return (
      <QuickSearchContainer
        placeholder={this.props.intl.formatMessage(
          messages.confluence_search_placeholder,
        )}
        linkComponent={linkComponent}
        getSearchResultsComponent={this.getSearchResultsComponent}
        getRecentItems={this.getRecentItems}
        getSearchResults={this.getSearchResults}
        getAbTestData={this.getAbTestData}
        handleSearchSubmit={this.handleSearchSubmit}
        getPreQueryDisplayedResults={this.getPreQueryDisplayedResults}
        getPostQueryDisplayedResults={this.getPostQueryDisplayedResults}
        logger={logger}
        inputControls={inputControls}
      />
    );
  }
}

export default injectIntl<Props>(
  withAnalytics(ConfluenceQuickSearchContainer, {}, {}),
);
