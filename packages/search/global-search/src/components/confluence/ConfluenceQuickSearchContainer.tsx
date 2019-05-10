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
import { Scope } from '../../api/types';
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
import { AutoCompleteClient } from '../../api/AutoCompleteClient';
import { appendListWithoutDuplication } from '../../util/search-results-utils';
import { isInFasterSearchExperiment } from '../../util/experiment-utils';

export interface Props {
  crossProductSearchClient: CrossProductSearchClient;
  peopleSearchClient: PeopleSearchClient;
  confluenceClient: ConfluenceClient;
  autocompleteClient: AutoCompleteClient;
  firePrivateAnalyticsEvent?: FireAnalyticsEvent;
  linkComponent?: LinkComponent;
  createAnalyticsEvent?: CreateAnalyticsEventFn;
  referralContextIdentifiers?: ReferralContextIdentifiers;
  isSendSearchTermsEnabled?: boolean;
  useQuickNavForPeopleResults?: boolean;
  useCPUSForPeopleResults?: boolean;
  logger: Logger;
  fasterSearchFFEnabled: boolean;
  onAdvancedSearch?: (
    e: CancelableEvent,
    entity: string,
    query: string,
    searchSessionId: string,
  ) => void;
  inputControls?: JSX.Element;
  isAutocompleteEnabled?: boolean;
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
  searchResults: ConfluenceResultsMap | undefined,
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
    const {
      crossProductSearchClient,
      useCPUSForPeopleResults,
      referralContextIdentifiers,
    } = this.props;

    let scopes = [Scope.ConfluencePageBlogAttachment, Scope.ConfluenceSpace];

    if (useCPUSForPeopleResults) {
      scopes.push(Scope.People);
    }

    const results = await crossProductSearchClient.search(
      query,
      sessionId,
      scopes,
      'confluence',
      queryVersion,
      null,
      referralContextIdentifiers,
    );

    return results;
  }

  async searchPeople(query: string, sessionId: string): Promise<Result[]> {
    const {
      useCPUSForPeopleResults,
      useQuickNavForPeopleResults,
      confluenceClient,
      peopleSearchClient,
    } = this.props;

    if (useQuickNavForPeopleResults) {
      return handlePromiseError(
        confluenceClient.searchPeopleInQuickNav(query, sessionId),
        [],
        this.handleSearchErrorAnalyticsThunk('search-people-quicknav'),
      );
    }

    // people results will be returned by xpsearch
    if (useCPUSForPeopleResults) {
      return Promise.resolve([]);
    }

    // fall back to directory search
    return handlePromiseError(
      peopleSearchClient.search(query),
      [],
      this.handleSearchErrorAnalyticsThunk('search-people'),
    );
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
    const { useCPUSForPeopleResults } = this.props;

    const confXpSearchPromise = handlePromiseError(
      this.searchCrossProductConfluence(query, sessionId, queryVersion),
      EMPTY_CROSS_PRODUCT_SEARCH_RESPONSE,
      this.handleSearchErrorAnalyticsThunk('xpsearch-confluence'),
    );

    const searchPeoplePromise = this.searchPeople(query, sessionId);

    const mapPromiseToPerformanceTime = (p: Promise<any>) =>
      p.then(() => performanceNow() - startTime);

    return Promise.all<CrossProductSearchResults, Result[], number, number>([
      confXpSearchPromise,
      searchPeoplePromise,
      mapPromiseToPerformanceTime(confXpSearchPromise),
      mapPromiseToPerformanceTime(searchPeoplePromise),
    ]).then(
      ([
        xpsearchResults,
        peopleResults,
        confSearchElapsedMs,
        peopleElapsedMs,
      ]) => ({
        results: {
          objects:
            xpsearchResults.results.get(Scope.ConfluencePageBlogAttachment) ||
            [],
          spaces: xpsearchResults.results.get(Scope.ConfluenceSpace) || [],
          people: useCPUSForPeopleResults
            ? xpsearchResults.results.get(Scope.People) || []
            : peopleResults,
        },
        timings: {
          confSearchElapsedMs,
          peopleElapsedMs,
        },
      }),
    );
  };

  getAbTestData = (sessionId: string): Promise<ABTest> => {
    return this.props.crossProductSearchClient.getAbTestData(
      Scope.ConfluencePageBlogAttachment,
    );
  };

  getRecentItems = (sessionId: string): Promise<ResultsWithTiming> => {
    const { confluenceClient, peopleSearchClient } = this.props;

    const recentActivityPromisesMap = {
      'recent-confluence-items': confluenceClient.getRecentItems(sessionId),
      'recent-confluence-spaces': confluenceClient.getRecentSpaces(sessionId),
      'recent-people': peopleSearchClient.getRecentPeople(),
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

  getAutocomplete = (query: string): Promise<string[]> => {
    const { autocompleteClient } = this.props;

    const autocompletePromise = handlePromiseError(
      autocompleteClient.getAutocomplete(query),
      [query],
      this.handleSearchErrorAnalyticsThunk('xpsearch-autocomplete'),
    );

    return autocompletePromise;
  };

  getPreQueryDisplayedResults = (
    recentItems: ConfluenceResultsMap,
    abTest: ABTest,
  ) => mapRecentResultsToUIGroups(recentItems, abTest);

  getPostQueryDisplayedResults = (
    searchResults: ConfluenceResultsMap,
    latestSearchQuery: string,
    recentItems: ConfluenceResultsMap,
    abTest: ABTest,
    isLoading: boolean,
    inFasterSearchExperiment: boolean,
  ) => {
    if (inFasterSearchExperiment) {
      const currentSearchResults: ConfluenceResultsMap = isLoading
        ? ({
            ...searchResults,
            objects: [] as Result[],
          } as ConfluenceResultsMap)
        : (searchResults as ConfluenceResultsMap);

      const recentResults = getRecentItemMatches(
        latestSearchQuery,
        recentItems as ConfluenceResultsMap,
      );
      const mergedRecentSearchResults = mergeSearchResultsWithRecentItems(
        currentSearchResults,
        recentResults,
      );
      return mapSearchResultsToUIGroups(mergedRecentSearchResults, abTest);
    } else {
      return mapSearchResultsToUIGroups(
        searchResults as ConfluenceResultsMap,
        abTest,
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
    const { onAdvancedSearch = () => {}, fasterSearchFFEnabled } = this.props;

    const inFasterSearchExperiment = isInFasterSearchExperiment(
      abTest,
      fasterSearchFFEnabled,
    );

    return (
      <SearchResultsComponent
        isPreQuery={!latestSearchQuery}
        isError={isError}
        isLoading={isLoading}
        retrySearch={retrySearch}
        keepPreQueryState={inFasterSearchExperiment ? false : keepPreQueryState}
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
          )
        }
        getPostQueryGroups={() =>
          this.getPostQueryDisplayedResults(
            searchResults as ConfluenceResultsMap,
            latestSearchQuery,
            recentItems as ConfluenceResultsMap,
            abTest,
            isLoading,
            inFasterSearchExperiment,
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
    const {
      linkComponent,
      isSendSearchTermsEnabled,
      logger,
      inputControls,
      isAutocompleteEnabled,
      fasterSearchFFEnabled,
    } = this.props;

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
        getAutocomplete={
          isAutocompleteEnabled ? this.getAutocomplete : undefined
        }
        handleSearchSubmit={this.handleSearchSubmit}
        isSendSearchTermsEnabled={isSendSearchTermsEnabled}
        getPreQueryDisplayedResults={this.getPreQueryDisplayedResults}
        getPostQueryDisplayedResults={this.getPostQueryDisplayedResults}
        logger={logger}
        inputControls={inputControls}
        fasterSearchFFEnabled={fasterSearchFFEnabled}
      />
    );
  }
}

export default injectIntl<Props>(
  withAnalytics(ConfluenceQuickSearchContainer, {}, {}),
);
