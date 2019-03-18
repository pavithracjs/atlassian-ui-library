import * as React from 'react';
import * as debounce from 'lodash.debounce';
import { QuickSearch } from '@atlaskit/quick-search';
import { ObjectResult } from '@atlaskit/quick-search';
import { colors } from '@atlaskit/theme';
import DocumentFilledIcon from '@atlaskit/icon/glyph/document-filled';
import { injectIntl, InjectedIntlProps } from 'react-intl';

import { messages } from '../../messages';
import { ArticleItem } from '../../model/Article';
import { SearchList } from './styled';

export interface Props {
  isLoading?: boolean;
  onSearchInput(event: React.FormEvent<HTMLInputElement>): void;
  searchResult?: ArticleItem[];
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
    } = this.props;

    return (
      <QuickSearch
        placeholder={formatMessage(messages.help_panel_search_placeholder)}
        value={this.state.value}
        isLoading={isLoading}
        onSearchInput={this.handleSearchInput}
      >
        {searchResult.length > 0 ? (
          <SearchList>
            {searchResult.map(searchResultItem => {
              return (
                <ObjectResult
                  resultId={searchResultItem.id}
                  name={searchResultItem.title}
                  key={searchResultItem.id}
                  containerName={searchResultItem.description}
                  avatar={
                    <DocumentFilledIcon
                      primaryColor={colors.P500}
                      size="medium"
                      label={searchResultItem.title}
                    />
                  }
                />
              );
            })}
          </SearchList>
        ) : null}
      </QuickSearch>
    );
  }
}

export default injectIntl(Search);
