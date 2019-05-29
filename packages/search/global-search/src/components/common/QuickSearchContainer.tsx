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
import { ABTest, DEFAULT_AB_TEST } from '../../api/CrossProductSearchClient';
import deepEqual from 'deep-equal';

const resultMapToArray = (results: ResultsGroup[]): Result[][] =>
  results.map(result => result.items);

export interface SearchResultProps extends State {
  retrySearch: () => void;
  abTest: ABTest;
}

export interface Props {
  logger: Logger;
  linkComponent?: LinkComponent;
  getSearchResultsComponent(state: SearchResultProps): React.ReactNode;
  getRecentItems(
    sessionId: string,
    abTest?: ABTest,
  ): Promise<ResultsWithTiming>;
  getSearchResults(
    query: string,
    sessionId: string,
    startTime: number,
    queryVersion: number,
    abTest?: ABTest,
  ): Promise<ResultsWithTiming>;
  getAbTestData(sessionId: string): Promise<ABTest>;
  referralContextIdentifiers?: ReferralContextIdentifiers;

  /**
   * return displayed groups for pre query searches
   * Used by analytics to tell how many ui groups are displayed for user
   * for example in jira we pass (issues, boards, filters and projects but we display only 2 groups issues and others combined)
   * @param results
   */

  getPreQueryDisplayedResults(
    results: GenericResultMap | null,
    abTest: ABTest,
    searchSessionId: string,
  ): ResultsGroup[];
  /**
   * return displayed groups for post query searches
   * Used by analytics to tell how many ui groups are displayed for user
   * for example in jira we pass (issues, boards, filters and projects but we display only 2 groups issues and others combined)
   * @param results
   */
  getPostQueryDisplayedResults(
    searchResults: GenericResultMap,
    latestSearchQuery: string,
    recentItems: GenericResultMap,
    abTest: ABTest,
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
}

export interface State {
  latestSearchQuery: string;
  searchSessionId: string;
  isLoading: boolean;
  isError: boolean;
  keepPreQueryState: boolean;
  searchResults: GenericResultMap | null;
  recentItems: GenericResultMap | null;
  abTest?: ABTest;
}

const LOGGER_NAME = 'AK.GlobalSearch.QuickSearchContainer';
/**
 * Container/Stateful Component that handles the data fetching and state handling when the user interacts with Search.
 */
export class QuickSearchContainer extends React.Component<Props, State> {
  // used to terminate if component is unmounted while waiting for a promise
  unmounted: boolean = false;
  latestQueryVersion: number = 0;

  constructor(props: Props) {
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

  shouldComponentUpdate(nextProps: Props, nextState: State) {
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
        this.state.abTest,
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
            if (this.state.abTest) {
              this.fireShownPostQueryEvent(
                startTime,
                elapsedMs,
                this.state.searchResults || {},
                this.state.recentItems || {},
                timings || {},
                this.state.searchSessionId,
                this.state.latestSearchQuery,
                this.state.abTest,
                this.state.isLoading,
              );
            }
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

  fetchAbTestDataOrDefault = async (searchSessionId: string) => {
    const { getAbTestData } = this.props;
    const startTime = performanceNow();

    let abTest: ABTest;
    try {
      abTest = await getAbTestData(searchSessionId);
    } catch (error) {
      abTest = DEFAULT_AB_TEST;
    }

    const elapsedMs = performanceNow() - startTime;

    this.setState({
      abTest,
    });

    return {
      elapsedMs,
      abTest,
    };
  };

  fireExperimentExposureEvent = async (
    searchSessionId: string,
    abTestPromise: Promise<ABTest>,
  ) => {
    const { createAnalyticsEvent, logger } = this.props;

    const abTest = await abTestPromise;

    if (createAnalyticsEvent) {
      try {
        if (abTest) {
          fireExperimentExposureEvent(
            abTest,
            searchSessionId,
            createAnalyticsEvent,
          );
        }
      } catch (e) {
        logger.safeWarn(LOGGER_NAME, 'error while getting abtest data', e);
      }
    }
  };

  fireShownPreQueryEvent = (
    searchSessionId: string,
    recentItems: GenericResultMap,
    abTest: ABTest,
    requestStartTime?: number,
    experimentRequestDurationMs?: number,
    renderStartTime?: number,
  ) => {
    const {
      createAnalyticsEvent,
      getPreQueryDisplayedResults,
      enablePreQueryFromAggregator,
      referralContextIdentifiers,
    } = this.props;
    if (createAnalyticsEvent && getPreQueryDisplayedResults) {
      const elapsedMs: number = requestStartTime
        ? performanceNow() - requestStartTime
        : 0;

      const renderTime: number = renderStartTime
        ? performanceNow() - renderStartTime
        : 0;

      const resultsArray: Result[][] = resultMapToArray(
        getPreQueryDisplayedResults(recentItems, abTest, searchSessionId),
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
        abTest,
        referralContextIdentifiers,
        experimentRequestDurationMs,
        !!enablePreQueryFromAggregator,
      );
    }
  };

  fireShownPostQueryEvent = (
    startTime: number,
    elapsedMs: number,
    searchResults: GenericResultMap,
    recentItems: GenericResultMap,
    timings: Record<string, number | React.ReactText>,
    searchSessionId: string,
    latestSearchQuery: string,
    abTest: ABTest,
    isLoading: boolean,
  ) => {
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
          abTest,
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
        abTest,
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
          if (this.state.abTest) {
            this.fireShownPreQueryEvent(
              this.state.searchSessionId,
              this.state.recentItems || {},
              this.state.abTest,
            );
          }
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

    if (!this.state.isLoading) {
      this.setState({
        isLoading: true,
      });
    }

    const abTestPromise = this.fetchAbTestDataOrDefault(
      this.state.searchSessionId,
    );
    this.fireExperimentExposureEvent(
      this.state.searchSessionId,
      abTestPromise.then(({ abTest }) => abTest),
    );

    try {
      const { results } = await this.props.getRecentItems(
        this.state.searchSessionId,
        this.state.abTest,
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
          const {
            elapsedMs: experimentRequestDurationMs,
            abTest,
          } = await abTestPromise;

          this.fireShownPreQueryEvent(
            this.state.searchSessionId,
            this.state.recentItems || {},
            abTest,
            startTime,
            experimentRequestDurationMs,
            renderStartTime,
          );
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
      abTest,
    } = this.state;

    if (!abTest) {
      return null;
    }

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
          abTest,
        })}
      </GlobalQuickSearch>
    );
  }
}

export default withAnalyticsEvents()(
  QuickSearchContainer,
) as typeof QuickSearchContainer;
