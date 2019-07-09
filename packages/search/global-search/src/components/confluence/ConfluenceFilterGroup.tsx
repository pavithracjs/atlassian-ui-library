import * as React from 'react';
import { ResultItemGroup, CancelableEvent } from '@atlaskit/quick-search';
import Button from '@atlaskit/button';
import { messages } from '../../messages';
import { FormattedMessage } from 'react-intl';
import { Filter } from '../../api/CrossProductSearchClient';
import ConfluenceSpaceFilter from './SpaceFilter';
import styled from 'styled-components';

interface Props {
  spaceAvatar: string;
  spaceTitle: string;
  spaceKey: string;
  isDisabled?: boolean;
  isFilterOn: boolean;
  onFilterChanged(filter: Filter[]): void;
  onAdvancedSearch(event: CancelableEvent): void;
}

const Container = styled.span`
  display: inline-flex;
  align-items: center;
`;

export default class ConfluenceFilterGroup extends React.Component<Props> {
  render() {
    const { onAdvancedSearch } = this.props;
    return (
      <ResultItemGroup
        title={<FormattedMessage {...messages.confluence_space_filter} />}
      >
        <Container>
          <ConfluenceSpaceFilter {...this.props} />
          <Button appearance="link" onClick={onAdvancedSearch}>
            <FormattedMessage {...messages.confluence_more_filters} />
          </Button>
        </Container>
      </ResultItemGroup>
    );
  }
}
