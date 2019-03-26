import * as React from 'react';
import * as debounce from 'lodash.debounce';
import { QuickSearch } from '@atlaskit/quick-search';
import { injectIntl, InjectedIntlProps } from 'react-intl';

import { messages } from '../../messages';
import { REQUEST_STATE } from '../../model/Resquests';
import { withHelp, HelpContextInterface } from '../HelpContext';

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

  handleSearchInput = ({ target }) => {
    const value = target.value;
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
      <QuickSearch
        placeholder={formatMessage(messages.help_panel_search_placeholder)}
        value={this.state.value}
        isLoading={searchState === REQUEST_STATE.loading}
        onSearchInput={this.handleSearchInput}
      >
        <SearchContent />
      </QuickSearch>
    );
  }
}

export default withHelp(injectIntl(Search));
