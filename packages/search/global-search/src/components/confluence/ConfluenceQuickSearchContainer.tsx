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
} from '../../api/CrossProductSearchClient';
import { Scope, ConfluenceModelContext } from '../../api/types';
import {
  Result,
  ResultsWithTiming,
  ConfluenceResultsMap,
  PersonResult,
  ConfluenceObjectResult,
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
  ITEMS_PER_PAGE,
  MAX_PAGE_COUNT,
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
  recentItems: ConfluenceResultsMap | null,
): ConfluenceObjectResult[] => {
  if (!recentItems) {
    return [];
  }

  return recentItems.objects.items
    .filter(result => {
      return result.name.toLowerCase().indexOf(query.toLowerCase()) > -1;
    })
    .slice(0, MAX_RECENT_RESULTS_TO_SHOW);
};

const mergeSearchResultsWithRecentItems = (
  searchResults: ConfluenceResultsMap,
  recentItems: ConfluenceObjectResult[],
): ConfluenceResultsMap => {
  const defaultSearchResults: ConfluenceResultsMap = {
    objects: {
      items: [],
      totalSize: 0,
    },
    spaces: {
      items: [],
      totalSize: 0,
    },
    people: {
      items: [],
      totalSize: 0,
    },
  };

  const results = { ...defaultSearchResults, ...searchResults };

  return {
    objects: {
      items: appendListWithoutDuplication(recentItems, results.objects.items),
      // We don't add the 3 extra results to the total.
      // The rationale here is that the server results will eventually contain the 3 recent items
      // so the total here already includes the recent items.
      // In the case where we don't know the number from the server, we also can't show more so
      // this numeber should just be the size of the current list.
      totalSize: results.objects.totalSize,
    },
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
    const { crossProductSearchClient, modelContext, features } = this.props;

    let scopes = [Scope.ConfluencePageBlogAttachment, Scope.ConfluenceSpace];

    scopes.push(Scope.People);

    const modelParams = buildConfluenceModelParams(
      queryVersion,
      modelContext || {},
    );

    const limit = features.searchExtensionsEnabled
      ? ITEMS_PER_PAGE * MAX_PAGE_COUNT
      : null;

    const results = await crossProductSearchClient.search(
      query,
      sessionId,
      scopes,
      modelParams,
      limit,
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
  ): Promise<ResultsWithTiming<ConfluenceResultsMap>> => {
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
    ]).then(([xpsearchResults, confSearchElapsedMs]) => {
      const spaces = xpsearchResults.results[Scope.ConfluenceSpace];
      const objects =
        xpsearchResults.results[Scope.ConfluencePageBlogAttachment];
      const people = xpsearchResults.results[Scope.People];

      return {
        results: {
          objects: {
            items: objects ? objects.items : [],
            totalSize: objects ? objects.totalSize : 0,
          },
          spaces: {
            items: spaces ? spaces.items : [],
            totalSize: spaces ? spaces.totalSize : 0,
          },
          people: {
            items: people ? people.items : [],
            totalSize: people ? people.totalSize : 0,
          },
        },
        timings: {
          confSearchElapsedMs,
        },
      };
    });
  };

  getRecentPeople = (sessionId: string): Promise<PersonResult[]> => {
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
          .then(xProductResult => {
            const recentPeople = xProductResult.results[Scope.UserConfluence];
            return recentPeople ? recentPeople.items : [];
          });
  };

  getRecentItems = async (
    sessionId: string,
  ): Promise<ResultsWithTiming<ConfluenceResultsMap>> => {
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

    // NOTE:
    // We lose type safety here as typescript assumes there's no guarantee the order in which a map
    // gets converted into promises. Also there is currently no way (and no way in the forseeable future)
    // to get typescript to convert union types into tuple types (https://github.com/Microsoft/TypeScript/issues/13298)
    return Promise.all(recentActivityPromises).then(
      ([
        recentlyViewedPages,
        recentlyViewedSpaces,
        recentlyInteractedPeople,
      ]) => {
        recentlyViewedPages;
        return {
          results: {
            objects: {
              items: recentlyViewedPages as ConfluenceObjectResult[],
              totalSize: recentlyViewedPages.length,
            },
            spaces: {
              items: recentlyViewedSpaces as Result[],
              totalSize: recentlyViewedSpaces.length,
            },
            people: {
              items: recentlyInteractedPeople as PersonResult[],
              totalSize: recentlyInteractedPeople.length,
            },
          },
        };
      },
    );
  };

  getPreQueryDisplayedResults = (
    recentItems: ConfluenceResultsMap | null,
    searchSessionId: string,
  ) => {
    const { features } = this.props;
    return mapRecentResultsToUIGroups(recentItems, features, searchSessionId);
  };

  getPostQueryDisplayedResults = (
    searchResults: ConfluenceResultsMap | null,
    latestSearchQuery: string,
    recentItems: ConfluenceResultsMap | null,
    isLoading: boolean,
    searchSessionId: string,
  ) => {
    const { features } = this.props;
    if (features.isInFasterSearchExperiment) {
      const currentSearchResults: ConfluenceResultsMap =
        isLoading || !searchResults
          ? ({} as ConfluenceResultsMap)
          : searchResults;

      const recentResults = getRecentItemMatches(
        latestSearchQuery,
        recentItems,
      );

      const mergedRecentSearchResults = mergeSearchResultsWithRecentItems(
        currentSearchResults,
        recentResults,
      );

      return mapSearchResultsToUIGroups(
        mergedRecentSearchResults,
        features,
        searchSessionId,
      );
    } else {
      return mapSearchResultsToUIGroups(
        searchResults,
        features,
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
    searchMore,
    waitingForMoreResults,
    errorGettingMoreResults,
  }: SearchResultProps<ConfluenceResultsMap>) => {
    const { onAdvancedSearch = () => {}, features } = this.props;
    const onSearchMoreAdvancedSearchClicked = (event: CancelableEvent) => {
      onAdvancedSearch(
        event,
        ConfluenceAdvancedSearchTypes.Content,
        latestSearchQuery,
        searchSessionId,
      );
    };

    return (
      <SearchResultsComponent
        query={latestSearchQuery}
        isPreQuery={!latestSearchQuery}
        isError={isError}
        isLoading={isLoading}
        waitingForMoreResults={waitingForMoreResults}
        errorGettingMoreResults={errorGettingMoreResults}
        retrySearch={retrySearch}
        searchMore={searchMore}
        onSearchMoreAdvancedSearchClicked={onSearchMoreAdvancedSearchClicked}
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
          this.getPreQueryDisplayedResults(recentItems, searchSessionId)
        }
        getPostQueryGroups={() =>
          this.getPostQueryDisplayedResults(
            searchResults,
            latestSearchQuery,
            recentItems,
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
    const { linkComponent, logger, inputControls, features } = this.props;

    return (
      <QuickSearchContainer
        placeholder={this.props.intl.formatMessage(
          messages.confluence_search_placeholder,
        )}
        linkComponent={linkComponent}
        getSearchResultsComponent={this.getSearchResultsComponent}
        getRecentItems={this.getRecentItems}
        getSearchResults={this.getSearchResults}
        product="confluence"
        handleSearchSubmit={this.handleSearchSubmit}
        getPreQueryDisplayedResults={this.getPreQueryDisplayedResults}
        getPostQueryDisplayedResults={this.getPostQueryDisplayedResults}
        logger={logger}
        inputControls={inputControls}
        features={features}
      />
    );
  }
}

export default injectIntl<Props>(
  withAnalytics(ConfluenceQuickSearchContainer, {}, {}),
);
