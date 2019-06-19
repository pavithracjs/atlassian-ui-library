import * as React from 'react';

import { MIN_CHARACTERS_FOR_SEARCH } from '../constants';
import { REQUEST_STATE } from '../../model/Requests';

import { withHelp, HelpContextInterface } from '../HelpContext';
import SearchResult from './SearchResults';
import SearchResultsEmpty from './SearchResultsEmpty';

export interface Props {}

export const SearchContent = (props: Props & HelpContextInterface) => {
  const {
    help: { searchValue, searchResult, searchState },
  } = props;
  if (searchValue.length > MIN_CHARACTERS_FOR_SEARCH) {
    if (searchResult.length > 0) {
      return <SearchResult searchResult={searchResult} />;
    } else if (searchState !== REQUEST_STATE.loading) {
      return <SearchResultsEmpty />;
    }
  } else if (
    searchResult.length > 0 &&
    searchValue.length <= MIN_CHARACTERS_FOR_SEARCH &&
    searchValue.length > 0
  ) {
    return <SearchResult searchResult={searchResult} />;
  }
  return null;
};

export default withHelp(SearchContent);
