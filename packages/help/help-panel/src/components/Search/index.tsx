import * as React from 'react';
import debounce from 'lodash.debounce';
import { QuickSearch } from '@atlaskit/quick-search';

import { injectIntl, InjectedIntlProps } from 'react-intl';
import { messages } from '../../messages';

import { REQUEST_STATE } from '../../model/Requests';
import { withHelp, HelpContextInterface } from '../HelpContext';

import { SearchContainer } from './styled';
import SearchContent from './SearchContent';
export interface Props {
  displayResults: boolean;
}

export interface State {
  value: string;
}

export class Search extends React.Component<
  Props & InjectedIntlProps & HelpContextInterface,
  State
> {
  state = {
    value: '',
  };

  handleSearchInput = ({ target }: React.FormEvent<HTMLInputElement>) => {
    const value = (target as HTMLInputElement).value;
    this.setState({
      value,
    });
    this.debouncedSearch(value);
  };

  debouncedSearch = debounce(this.props.help.onSearch, 350);

  render() {
    const {
      intl: { formatMessage },
      help: { searchState },
    } = this.props;

    return (
      <SearchContainer>
        <QuickSearch
          placeholder={formatMessage(messages.help_panel_search_placeholder)}
          value={this.state.value}
          isLoading={searchState === REQUEST_STATE.loading}
          onSearchInput={this.handleSearchInput}
        >
          <SearchContent />
        </QuickSearch>
      </SearchContainer>
    );
  }
}

export default withHelp(injectIntl(Search));
