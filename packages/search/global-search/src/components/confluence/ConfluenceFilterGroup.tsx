import * as React from 'react';
import { ResultItemGroup } from '@atlaskit/quick-search';
import { messages } from '../../messages';
import { FormattedMessage } from 'react-intl';
import { Filter } from '../../api/CrossProductSearchClient';
import ConfluenceSpaceFilter from './SpaceFilter';

interface Props {
  spaceAvatar: string;
  spaceTitle: string;
  spaceKey: string;
  isDisabled?: boolean;
  isFilterOn: boolean;
  onFilterChanged(filter: Filter[]): void;
}

export default class ConfluenceFilterGroup extends React.Component<Props> {
  render() {
    return (
      <ResultItemGroup
        title={<FormattedMessage {...messages.confluence_space_filter} />}
      >
        <ConfluenceSpaceFilter {...this.props} />
      </ResultItemGroup>
    );
  }
}
