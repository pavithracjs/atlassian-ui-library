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
import { UIAnalyticsEvent } from '../../../../core/analytics-next';

export interface ShowMoreButtonProps {
  resultLength: number;
  totalSize: number;
  onShowMoreClicked: () => void;
  onSearchMoreAdvancedSearch: undefined | ((e: CancelableEvent) => void);
  query: string;
}

export class ShowMoreButton extends React.PureComponent<ShowMoreButtonProps> {
  triggerEnrichedEvent(
    analyticsEvent: UIAnalyticsEvent,
    actionSubjectId: String,
  ) {
    const { resultLength, totalSize } = this.props;
    const payload = {
      ...analyticsEvent.payload,
      actionSubjectId,
      attributes: {
        ...(analyticsEvent.payload.attributes || {}),
        totalSize,
        currentSize: resultLength,
        searchSessionId: (analyticsEvent.context || []).reduce(
          (acc: object, v: object = {}) => Object.assign({}, acc, v),
          {},
        ).searchSessionId,
      },
    };
    const enrichedEvent = Object.assign({}, analyticsEvent, { payload });
    enrichedEvent.fire();
  }

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
          <Button
            appearance="link"
            onClick={(e, analyticsEvent) => {
              this.triggerEnrichedEvent(analyticsEvent, 'show_more_button');
              onShowMoreClicked();
            }}
          >
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
            onClick={(e, analyticsEvent) => {
              this.triggerEnrichedEvent(
                analyticsEvent,
                'show_more_advanced_search_button',
              );
              onSearchMoreAdvancedSearch(e);
            }}
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
