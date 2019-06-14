import * as React from 'react';
import Button from '@atlaskit/button';
import { CancelableEvent } from '@atlaskit/quick-search';
import { FormattedMessage } from 'react-intl';
import { messages } from '../messages';
import { getConfluenceAdvancedSearchLink } from './SearchResultsUtil';
import {
  CONF_OBJECTS_ITEMS_PER_PAGE,
  CONF_MAX_DISPLAYED_RESULTS,
} from '../util/experiment-utils';
import { ShowMoreButtonProps } from './ResultGroup';

export interface ShowMoreButtonProps {
  resultLength: number;
  totalSize: number;
  onShowMoreClicked: () => void;
  onSearchMoreAdvancedSearch: undefined | ((e: CancelableEvent) => void);
  query: string;
}

export class ShowMoreButton extends React.PureComponent<ShowMoreButtonProps> {
  render() {
    const {
      resultLength,
      totalSize,
      onShowMoreClicked,
      onSearchMoreAdvancedSearch,
      query,
    } = this.props;
    if (resultLength < totalSize) {
      if (resultLength < CONF_MAX_DISPLAYED_RESULTS) {
        return (
          <Button appearance="link" onClick={onShowMoreClicked}>
            <FormattedMessage
              {...messages.show_more_button_text}
              values={{
                itemsPerPage: Math.min(
                  CONF_OBJECTS_ITEMS_PER_PAGE,
                  totalSize - resultLength,
                ),
              }}
            />
          </Button>
        );
      } else if (onSearchMoreAdvancedSearch) {
        return (
          <Button
            appearance="link"
            onClick={onSearchMoreAdvancedSearch}
            href={getConfluenceAdvancedSearchLink(query)}
          >
            <FormattedMessage {...messages.show_more_button_advanced_search} />
          </Button>
        );
      }
    }
    return null;
  }
}
