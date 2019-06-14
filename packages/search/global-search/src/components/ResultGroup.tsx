import * as React from 'react';
import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme';
import { ResultItemGroup, CancelableEvent } from '@atlaskit/quick-search';
import Badge from '@atlaskit/badge';
import Button from '@atlaskit/button';

import { Result } from '../model/Result';
import ResultList from './ResultList';
import { injectIntl, InjectedIntlProps, FormattedMessage } from 'react-intl';
import { messages } from '../messages';
import { getConfluenceAdvancedSearchLink } from './SearchResultsUtil';
import {
  CONF_OBJECTS_ITEMS_PER_PAGE,
  CONF_MAX_DISPLAYED_RESULTS,
} from '../util/experiment-utils';

export interface Props {
  title?: JSX.Element | string;
  results: Result[];
  sectionIndex: number;
  analyticsData?: {};
  showTotalSize: boolean;
  totalSize: number;
  showMoreButton: boolean;
  onShowMoreClicked: () => void;
  onSearchMoreAdvancedSearch: undefined | ((e: CancelableEvent) => void);
  query: string;
}

const TitlelessGroupWrapper = styled.div`
  margin-top: ${gridSize() * 1.5}px;
`;

const BadgeContainer = styled.span`
  margin-left: ${gridSize()}px;
`;

interface ShowMoreButtonProps {
  resultLength: number;
  totalSize: number;
  onShowMoreClicked: () => void;
  onSearchMoreAdvancedSearch: undefined | ((e: CancelableEvent) => void);
  query: string;
}

class ShowMoreButton extends React.PureComponent<ShowMoreButtonProps> {
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

export class ResultGroup extends React.Component<Props & InjectedIntlProps> {
  render() {
    const {
      title,
      results,
      sectionIndex,
      showTotalSize,
      totalSize,
      showMoreButton,
      onShowMoreClicked,
      onSearchMoreAdvancedSearch,
      query,
    } = this.props;

    if (results.length === 0) {
      return null;
    }

    const moreButton = showMoreButton ? (
      <ShowMoreButton
        resultLength={results.length}
        onShowMoreClicked={onShowMoreClicked}
        onSearchMoreAdvancedSearch={onSearchMoreAdvancedSearch}
        totalSize={totalSize}
        query={query}
      />
    ) : null;

    if (!title) {
      return (
        <TitlelessGroupWrapper>
          <ResultList
            analyticsData={this.props.analyticsData}
            results={results}
            sectionIndex={sectionIndex}
          />
          {moreButton}
        </TitlelessGroupWrapper>
      );
    }

    const titleView = showTotalSize ? (
      <>
        <span>{title}</span>
        <BadgeContainer>
          <Badge max={99}>{totalSize}</Badge>
        </BadgeContainer>
      </>
    ) : (
      <span>{title}</span>
    );

    return (
      <ResultItemGroup title={titleView}>
        <ResultList
          analyticsData={this.props.analyticsData}
          results={results}
          sectionIndex={sectionIndex}
        />
        {moreButton}
      </ResultItemGroup>
    );
  }
}

export default injectIntl(ResultGroup);
