import * as React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { messages } from '../../messages';

import NoResultsImage from '../../assets/NoResultsImage';
import { SearchResultEmptyMessage } from './styled';

export interface Props {}

export const SearchResultsEmpty = (props: Props & InjectedIntlProps) => {
  const {
    intl: { formatMessage },
  } = props;

  return (
    <SearchResultEmptyMessage>
      <NoResultsImage />
      <p>{formatMessage(messages.help_panel_search_results_no_results)}</p>
    </SearchResultEmptyMessage>
  );
};

export default injectIntl(SearchResultsEmpty);
