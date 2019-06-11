import * as React from 'react';
import PreQueryState from './PreQueryState';
import { isEmpty } from '../SearchResultsUtil';
import { PostQueryAnalyticsComponent } from './ScreenAnalyticsHelper';
import { ScreenCounter } from '../../util/ScreenCounter';
import { ReferralContextIdentifiers } from '../GlobalQuickSearchWrapper';
import ResultGroupsComponent, {
  ResultGroupType,
} from './ResultGroupsComponent';
import { ResultsGroup } from '../../model/Result';
import SearchError from '../SearchError';
import deepEqual from 'deep-equal';
import { Scope } from '../../api/types';
import { CancelableEvent } from '../../../../quick-search';

export interface Props {
  isPreQuery: boolean;
  query: string;
  isError: boolean;
  isLoading: boolean;
  waitingForMoreResults: boolean;
  errorGettingMoreResults: boolean;
  renderNoResult: () => JSX.Element;
  renderNoRecentActivity: () => JSX.Element;
  renderBeforePreQueryState?: () => JSX.Element;
  retrySearch(): void;
  searchMore: undefined | ((scope: Scope) => void);
  getPreQueryGroups: () => ResultsGroup[];
  getPostQueryGroups: () => ResultsGroup[];
  renderAdvancedSearchGroup: (analyticsData?: any) => JSX.Element;
  keepPreQueryState: boolean;
  searchSessionId: string;
  preQueryScreenCounter?: ScreenCounter;
  postQueryScreenCounter?: ScreenCounter;
  referralContextIdentifiers?: ReferralContextIdentifiers;
  onSearchMoreAdvancedSearchClicked?: (event: CancelableEvent) => void;
}

export enum SearchResultsState {
  PreQueryLoading,
  PreQueryResults,
  PreQueryNoResults,
  PostQueryResults,
  PostQueryNoResults,
  IntermediateResults,
  IntermediateNoResults,
}

interface SearchResultStateQuery {
  isPreQuery: boolean;
  isLoading: boolean;
  hasResults: boolean;
}

export const getSearchResultState = ({
  isPreQuery,
  isLoading,
  hasResults,
}: SearchResultStateQuery): SearchResultsState => {
  if (isPreQuery) {
    // Pre query
    if (isLoading) {
      return SearchResultsState.PreQueryLoading;
    }

    if (!hasResults) {
      return SearchResultsState.PreQueryNoResults;
    }

    return SearchResultsState.PreQueryResults;
  } else if (isLoading) {
    // Intermediate
    if (!hasResults) {
      return SearchResultsState.IntermediateNoResults;
    }

    return SearchResultsState.IntermediateResults;
  } else {
    // Post query
    if (!hasResults) {
      return SearchResultsState.PostQueryNoResults;
    }

    return SearchResultsState.PostQueryResults;
  }
};

export default class SearchResults extends React.Component<Props> {
  shouldComponentUpdate(nextProps: Props) {
    return !deepEqual(nextProps, this.props);
  }

  hasNoResult() {
    const {
      isPreQuery,
      isLoading,
      keepPreQueryState,
      getPreQueryGroups,
      getPostQueryGroups,
    } = this.props;

    const results =
      isPreQuery || (isLoading && keepPreQueryState)
        ? getPreQueryGroups()
        : getPostQueryGroups();
    return results.map(({ items }) => items).every(isEmpty);
  }

  renderNoResult() {
    const {
      renderNoResult,
      postQueryScreenCounter,
      searchSessionId,
      referralContextIdentifiers,
    } = this.props;
    return (
      <>
        {renderNoResult()}
        <PostQueryAnalyticsComponent
          screenCounter={postQueryScreenCounter}
          searchSessionId={searchSessionId}
          referralContextIdentifiers={referralContextIdentifiers}
          key="post-query-analytics"
        />
      </>
    );
  }

  renderPreQueryState() {
    const {
      searchSessionId,
      preQueryScreenCounter,
      renderNoRecentActivity,
      referralContextIdentifiers,
      renderBeforePreQueryState,
      renderAdvancedSearchGroup,
      getPreQueryGroups,
    } = this.props;
    return (
      <>
        {renderBeforePreQueryState && renderBeforePreQueryState()}
        <PreQueryState
          resultsGroups={getPreQueryGroups()}
          renderNoRecentActivity={renderNoRecentActivity}
          searchSessionId={searchSessionId}
          screenCounter={preQueryScreenCounter}
          referralContextIdentifiers={referralContextIdentifiers}
          renderAdvancedSearchGroup={renderAdvancedSearchGroup}
        />
      </>
    );
  }

  renderSearchResultsState() {
    const {
      searchSessionId,
      referralContextIdentifiers,
      renderAdvancedSearchGroup,
      getPostQueryGroups,
      postQueryScreenCounter,
      searchMore,
      waitingForMoreResults,
      errorGettingMoreResults,
      onSearchMoreAdvancedSearchClicked,
      query,
    } = this.props;

    return (
      <ResultGroupsComponent
        query={query}
        type={ResultGroupType.PostQuery}
        renderAdvancedSearch={renderAdvancedSearchGroup}
        resultsGroups={getPostQueryGroups()}
        searchSessionId={searchSessionId}
        screenCounter={postQueryScreenCounter}
        referralContextIdentifiers={referralContextIdentifiers}
        onShowMoreClicked={searchMore || (() => {})}
        waitingForMoreResults={waitingForMoreResults}
        errorGettingMoreResults={errorGettingMoreResults}
        onSearchMoreAdvancedSearchClicked={onSearchMoreAdvancedSearchClicked}
      />
    );
  }

  render() {
    const {
      isPreQuery,
      isError,
      isLoading,
      retrySearch,
      keepPreQueryState,
    } = this.props;

    if (isError) {
      return <SearchError onRetryClick={retrySearch} />;
    }

    const searchResultState = getSearchResultState({
      isPreQuery,
      isLoading,
      hasResults: !this.hasNoResult(),
    });

    switch (searchResultState) {
      case SearchResultsState.PreQueryLoading:
        return null;
      case SearchResultsState.PreQueryNoResults:
        return this.renderPreQueryState();
      case SearchResultsState.PreQueryResults:
        return this.renderPreQueryState();
      case SearchResultsState.IntermediateNoResults:
        return keepPreQueryState ? this.renderPreQueryState() : null;
      case SearchResultsState.IntermediateResults:
        return keepPreQueryState
          ? this.renderPreQueryState()
          : this.renderSearchResultsState();
      case SearchResultsState.PostQueryNoResults:
        return this.renderNoResult();
      case SearchResultsState.PostQueryResults:
        return this.renderSearchResultsState();
      default:
        throw new Error('unhandled state');
    }
  }
}
