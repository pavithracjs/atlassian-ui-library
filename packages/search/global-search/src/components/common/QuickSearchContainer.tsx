import * as React from 'react';
import uuid from 'uuid/v4';
import {
  LinkComponent,
  Logger,
  ReferralContextIdentifiers,
} from '../GlobalQuickSearchWrapper';
import GlobalQuickSearch from '../GlobalQuickSearch';
import performanceNow from '../../util/performance-now';
import {
  GenericResultMap,
  ResultsWithTiming,
  Result,
  ResultsGroup,
  ConfluenceResultsMap,
  Results,
} from '../../model/Result';
import {
  ShownAnalyticsAttributes,
  buildShownEventDetails,
  PerformanceTiming,
} from '../../util/analytics-util';
import {
  firePreQueryShownEvent,
  firePostQueryShownEvent,
  fireExperimentExposureEvent,
} from '../../util/analytics-event-helper';
import { withAnalyticsEvents } from '@atlaskit/analytics-next';
import { CreateAnalyticsEventFn } from '../analytics/types';
import deepEqual from 'deep-equal';
import {
  JiraFeatures,
  ConfluenceFeatures,
  CommonFeatures,
} from '../../util/features';
import { Scope, QuickSearchContext } from '../../api/types';
import { CONF_OBJECTS_ITEMS_PER_PAGE } from '../../util/experiment-utils';

const resultMapToArray = (results: ResultsGroup[]): Result[][] =>
  results.map(result => result.items);

export interface SearchResultProps<T> extends State<T> {
  retrySearch: () => void;
  searchMore: (scope: Scope) => void;
}

export interface Props<T extends ConfluenceResultsMap | GenericResultMap> {
  logger: Logger;
  linkComponent?: LinkComponent;
  product: QuickSearchContext;
  getSearchResultsComponent(state: SearchResultProps<T>): React.ReactNode;
  getRecentItems(sessionId: string): Promise<ResultsWithTiming<T>>;
  getSearchResults(
    query: string,
    sessionId: string,
    startTime: number,
    queryVersion: number,
  ): Promise<ResultsWithTiming<T>>;
  referralContextIdentifiers?: ReferralContextIdentifiers;

  /**
   * return displayed groups for pre query searches
   * Used by analytics to tell how many ui groups are displayed for user
   * for example in jira we pass (issues, boards, filters and projects but we display only 2 groups issues and others combined)
   * @param results
   */

  getPreQueryDisplayedResults(
    results: T | null,
    searchSessionId: string,
  ): ResultsGroup[];
  /**
   * return displayed groups for post query searches
   * Used by analytics to tell how many ui groups are displayed for user
   * for example in jira we pass (issues, boards, filters and projects but we display only 2 groups issues and others combined)
   * @param results
   */
  getPostQueryDisplayedResults(
    searchResults: T | null,
    latestSearchQuery: string,
    recentItems: T | null,
    isLoading: boolean,
    searchSessionId: string,
  ): ResultsGroup[];

  createAnalyticsEvent?: CreateAnalyticsEventFn;
  handleSearchSubmit?(
    event: React.KeyboardEvent<HTMLInputElement>,
    searchSessionId: string,
  ): void;
  placeholder?: string;
  selectedResultId?: string;
  onSelectedResultIdChanged?: (id: string | null | number) => void;
  enablePreQueryFromAggregator?: boolean;
  inputControls?: JSX.Element;
  features: JiraFeatures | ConfluenceFeatures | CommonFeatures;
}

export interface State<T> {
  latestSearchQuery: string;
  searchSessionId: string;
  isLoading: boolean;
  isError: boolean;
  keepPreQueryState: boolean;
  searchResults: T | null;
  recentItems: T | null;
}

const LOGGER_NAME = 'AK.GlobalSearch.QuickSearchContainer';
/**
 * Container/Stateful Component that handles the data fetching and state handling when the user interacts with Search.
 */
export class QuickSearchContainer<
  T extends ConfluenceResultsMap | GenericResultMap
> extends React.Component<Props<T>, State<T>> {
  // used to terminate if component is unmounted while waiting for a promise
  unmounted: boolean = false;
  latestQueryVersion: number = 0;

  constructor(props: Props<T>) {
    super(props);
    this.state = {
      isLoading: true,
      isError: false,
      latestSearchQuery: '',
      searchSessionId: uuid(), // unique id for search attribution
      recentItems: null,
      searchResults: null,
      keepPreQueryState: true,
    };
  }

  shouldComponentUpdate(nextProps: Props<T>, nextState: State<T>) {
    return (
      !deepEqual(nextProps, this.props) || !deepEqual(nextState, this.state)
    );
  }

  componentDidCatch(error: any, info: any) {
    this.props.logger.safeError(LOGGER_NAME, 'component did catch an error', {
      error,
      info,
      safeState: {
        searchSessionId: this.state.searchSessionId,
        latestSearchQuery: !!this.state.latestSearchQuery,
        isLoading: this.state.isLoading,
        isError: this.state.isError,
        keepPreQueryState: this.state.keepPreQueryState,
        recentItems: !!this.state.recentItems,
        searchResults: !!this.state.searchResults,
      },
    });

    this.setState({
      isError: true,
    });
  }

  componentWillUnmount() {
    this.unmounted = true;
  }

  doSearch = async (query: string, queryVersion: number) => {
    const startTime: number = performanceNow();
    this.latestQueryVersion = queryVersion;

    try {
      const { results, timings } = await this.props.getSearchResults(
        query,
        this.state.searchSessionId,
        startTime,
        queryVersion,
      );

      if (this.unmounted) {
        return;
      }

      const elapsedMs = performanceNow() - startTime;
      if (this.state.latestSearchQuery === query) {
        this.setState(
          {
            searchResults: results,
            isError: false,
            isLoading: false,
            keepPreQueryState: false,
          },
          () => {
            this.fireShownPostQueryEvent(
              startTime,
              elapsedMs,
              this.state.searchResults || ({} as any), // Remove 'any' as part of QS-740
              this.state.recentItems || ({} as any), // Remove 'any' as part of QS-740
              timings || {},
              this.state.searchSessionId,
              this.state.latestSearchQuery,
              this.state.isLoading,
            );
          },
        );
      }
    } catch (e) {
      this.props.logger.safeError(
        LOGGER_NAME,
        'error while getting search results',
        e,
      );
      this.setState({
        isError: true,
        isLoading: false,
        keepPreQueryState: false,
      });
    }
  };

  fireExperimentExposureEvent = () => {
    const { createAnalyticsEvent, features } = this.props;
    const { searchSessionId } = this.state;

    if (createAnalyticsEvent) {
      fireExperimentExposureEvent(
        features.abTest,
        searchSessionId,
        createAnalyticsEvent,
      );
    }
  };

  fireShownPreQueryEvent = (
    requestStartTime?: number,
    renderStartTime?: number,
  ) => {
    const { searchSessionId, recentItems } = this.state;

    const {
      createAnalyticsEvent,
      getPreQueryDisplayedResults,
      enablePreQueryFromAggregator,
      referralContextIdentifiers,
      features,
    } = this.props;
    if (createAnalyticsEvent && getPreQueryDisplayedResults) {
      const elapsedMs: number = requestStartTime
        ? performanceNow() - requestStartTime
        : 0;

      const renderTime: number = renderStartTime
        ? performanceNow() - renderStartTime
        : 0;

      const resultsArray: Result[][] = resultMapToArray(
        getPreQueryDisplayedResults(recentItems, searchSessionId),
      );
      const eventAttributes: ShownAnalyticsAttributes = {
        ...buildShownEventDetails(...resultsArray),
      };

      firePreQueryShownEvent(
        eventAttributes,
        elapsedMs,
        renderTime,
        searchSessionId,
        createAnalyticsEvent,
        features.abTest,
        referralContextIdentifiers,
        !!enablePreQueryFromAggregator,
      );
    }
  };

  fireShownPostQueryEvent = (
    startTime: number,
    elapsedMs: number,
    searchResults: T,
    recentItems: T,
    timings: Record<string, number | React.ReactText>,
    searchSessionId: string,
    latestSearchQuery: string,
    isLoading: boolean,
  ) => {
    const { features } = this.props;
    const performanceTiming: PerformanceTiming = {
      startTime,
      elapsedMs,
      ...timings,
    };
    const {
      createAnalyticsEvent,
      getPostQueryDisplayedResults,
      referralContextIdentifiers,
    } = this.props;

    if (createAnalyticsEvent && getPostQueryDisplayedResults) {
      const resultsArray: Result[][] = resultMapToArray(
        getPostQueryDisplayedResults(
          searchResults,
          latestSearchQuery,
          recentItems,
          isLoading,
          searchSessionId,
        ),
      );
      const resultsDetails: ShownAnalyticsAttributes = buildShownEventDetails(
        ...resultsArray,
      );
      firePostQueryShownEvent(
        resultsDetails,
        performanceTiming,
        searchSessionId,
        latestSearchQuery,
        createAnalyticsEvent,
        features.abTest,
        referralContextIdentifiers,
      );
    }
  };

  handleSearch = (newLatestSearchQuery: string, queryVersion: number) => {
    if (this.state.latestSearchQuery === newLatestSearchQuery) {
      return;
    }

    this.setState({
      latestSearchQuery: newLatestSearchQuery,
      isLoading: true,
    });

    if (newLatestSearchQuery.length === 0) {
      // reset search results so that internal state between query and results stays consistent
      this.setState(
        {
          isError: false,
          isLoading: false,
          keepPreQueryState: true,
        },
        () => {
          this.fireShownPreQueryEvent();
        },
      );
    } else {
      this.doSearch(newLatestSearchQuery, queryVersion);
    }
  };

  retrySearch = () => {
    this.handleSearch(this.state.latestSearchQuery, this.latestQueryVersion);
  };

  async componentDidMount() {
    const startTime = performanceNow();

    this.fireExperimentExposureEvent();

    try {
      const { results } = await this.props.getRecentItems(
        this.state.searchSessionId,
      );
      const renderStartTime = performanceNow();
      if (this.unmounted) {
        return;
      }
      this.setState(
        {
          recentItems: results,
          isLoading: false,
        },
        async () => {
          this.fireShownPreQueryEvent(startTime, renderStartTime);
        },
      );
    } catch (e) {
      this.props.logger.safeError(
        LOGGER_NAME,
        'error while getting recent items',
        e,
      );
      if (this.state.isLoading) {
        this.setState({
          isLoading: false,
        });
      }
    }
  }

  getMoreSearchResults = async (scope: Scope) => {
    const { product } = this.props;
    if (product === 'confluence') {
      try {
        // This is a hack, we assume product = confluence means that this cast is safe. When GenericResultsMap is gone
        // we probably won't need this cast anymore.
        const currentResultsByScope = this.state
          .searchResults as ConfluenceResultsMap;

        // @ts-ignore More hacks as there's no guarantee that the scope is one that is available here
        const result: Results<Result> = currentResultsByScope[scope];

        if (result) {
          const currentItems =
            result.currentItems || CONF_OBJECTS_ITEMS_PER_PAGE;

          this.setState({
            searchResults: {
              ...(this.state.searchResults as any),
              [scope]: {
                ...result,
                currentItems: currentItems + CONF_OBJECTS_ITEMS_PER_PAGE,
              },
            },
          });
        }
      } catch (e) {
        this.props.logger.safeError(
          LOGGER_NAME,
          `error while getting mores results for ${scope}`,
          e,
        );
        this.setState({
          isLoading: false,
        });
      }
    }
  };

  handleSearchSubmit = (event: React.KeyboardEvent<HTMLInputElement>) => {
    const { handleSearchSubmit } = this.props;
    if (handleSearchSubmit) {
      handleSearchSubmit(event, this.state.searchSessionId);
    }
  };

  render() {
    const {
      linkComponent,
      getSearchResultsComponent,
      placeholder,
      selectedResultId,
      onSelectedResultIdChanged,
      inputControls,
    } = this.props;
    const {
      isLoading,
      searchSessionId,
      latestSearchQuery,
      isError,
      searchResults,
      recentItems,
      keepPreQueryState,
    } = this.state;

    return (
      <GlobalQuickSearch
        onSearch={this.handleSearch}
        onSearchSubmit={this.handleSearchSubmit}
        isLoading={isLoading}
        placeholder={placeholder}
        linkComponent={linkComponent}
        searchSessionId={searchSessionId}
        selectedResultId={selectedResultId}
        onSelectedResultIdChanged={onSelectedResultIdChanged}
        inputControls={inputControls}
      >
        {getSearchResultsComponent({
          retrySearch: this.retrySearch,
          latestSearchQuery,
          isError,
          searchResults,
          isLoading,
          recentItems,
          keepPreQueryState,
          searchSessionId,
          searchMore: this.getMoreSearchResults,
        })}
      </GlobalQuickSearch>
    );
  }
}

export default withAnalyticsEvents()(
  QuickSearchContainer,
) as typeof QuickSearchContainer;
