import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Button from '@atlaskit/button';
import { gridSize } from '@atlaskit/theme';
import styled from 'styled-components';
import { CancelableEvent } from '@atlaskit/quick-search';
import { messages } from '../../messages';
import AdvancedSearchResult from '../AdvancedSearchResult';
import { AnalyticsType } from '../../model/Result';
import {
  getJiraAdvancedSearchUrl,
  JiraEntityTypes,
  ADVANCED_JIRA_SEARCH_RESULT_ID,
} from '../SearchResultsUtil';
import { JiraApplicationPermission } from '../GlobalQuickSearchWrapper';

type onAdvancedSearchClick = (
  e: CancelableEvent,
  entity: JiraEntityTypes,
) => void;
export interface Props {
  query: string;
  showKeyboardLozenge?: boolean;
  showSearchIcon?: boolean;
  analyticsData?: object;
  onClick?: onAdvancedSearchClick;
  appPermission?: JiraApplicationPermission;
}

interface State {
  entity: JiraEntityTypes;
}

const TextContainer = styled.div`
  // padding: ${gridSize()}px 0;
  margin-right: ${gridSize()}px;
  height: 24px;
  line-height: 24px;
  white-space: nowrap;
`;

const Container = styled.div`
  margin: 12px;
  display: flex;
  flex-direction: row;
  justify-content: left;
`;

const ButtonWrapper = styled.div`
  margin-right: 4px;
`;
const itemI18nKeySuffix = [
  JiraEntityTypes.Issues,
  JiraEntityTypes.Boards,
  JiraEntityTypes.Projects,
  JiraEntityTypes.Filters,
  JiraEntityTypes.People,
];

const getI18nItemName = (i18nKeySuffix: string) => {
  const id = `jira_advanced_search_${i18nKeySuffix}` as keyof typeof messages;
  return <FormattedMessage {...messages[id]} />;
};
/**
 * Questions:
 * 1- check with mark if no issues and we have project/boards results what will happen to the advanced link
 * 2- move the top recent link as the bottom advanced link
 * 3- check if we need the callback or link component is enough
 * 4- analytics query version is missing
 */
export default class JiraAdvancedSearch extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.enrichedAnalyticsData = props.analyticsData;
  }

  static defaultProps = {
    showKeyboardLozenge: false,
    showSearchIcon: false,
  };

  state = {
    entity: JiraEntityTypes.Issues,
  };

  renderLinks = () =>
    itemI18nKeySuffix
      .filter(
        key =>
          !this.props.appPermission ||
          key !== JiraEntityTypes.Boards ||
          (this.props.appPermission &&
            this.props.appPermission.hasSoftwareAccess),
      )
      .map(item => (
        <ButtonWrapper key={`btnwrapper_${item}`}>
          <Button
            key={`btn_${item}`}
            spacing="compact"
            onMouseEnter={e => e.stopPropagation()}
            onClick={e => this.props.onClick && this.props.onClick(e, item)}
            href={getJiraAdvancedSearchUrl(item, this.props.query)}
          >
            {getI18nItemName(item)}
          </Button>
        </ButtonWrapper>
      ));

  selectedItem?: JiraEntityTypes;

  enrichedAnalyticsData?: object;

  render() {
    return (
      <Container>
        <TextContainer>
          <FormattedMessage {...messages.jira_advanced_search} />
        </TextContainer>
        {this.renderLinks()}
      </Container>
    );
  }
}
