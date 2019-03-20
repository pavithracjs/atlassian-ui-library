import * as React from 'react';
import * as debounce from 'lodash.debounce';
import { QuickSearch } from '@atlaskit/quick-search';
import { injectIntl, InjectedIntlProps } from 'react-intl';

import { messages } from '../../messages';
import { ArticleItem } from '../../model/Article';
import SearchResult from './SearchResults';
import SearchResultsEmpty from './SearchResultsEmpty';

export interface Props {
  isLoading?: boolean;
  onSearchInput(event: React.FormEvent<HTMLInputElement>): void;
  searchResult?: ArticleItem[];
  displayResults: boolean;
}

export interface State {
  value: string;
}

export class Search extends React.Component<Props & InjectedIntlProps, State> {
  state = {
    value: '',
  };

  handleSearchInput = ({ target }) => {
    const value = target.value;
    this.setState({
      value,
    });
    this.debouncedSearch(value);
  };

  debouncedSearch = debounce(this.props.onSearchInput, 350);

  render() {
    const {
      intl: { formatMessage },
      isLoading = false,
      searchResult = [],
      displayResults,
    } = this.props;

    return (
      <QuickSearch
        placeholder={formatMessage(messages.help_panel_search_placeholder)}
        value={this.state.value}
        isLoading={isLoading}
        onSearchInput={this.handleSearchInput}
      >
        {displayResults &&
          (searchResult.length > 0 ? (
            <SearchResult searchResult={searchResult} />
          ) : (
            <SearchResultsEmpty />
          ))}
      </QuickSearch>
    );
  }
}

export default injectIntl(Search);
