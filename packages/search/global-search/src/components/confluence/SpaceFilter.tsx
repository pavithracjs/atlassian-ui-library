import * as React from 'react';
import { ResultItemGroup } from '../../../../quick-search';
import Checkbox from '@atlaskit/checkbox/Checkbox';
import Avatar from '@atlaskit/avatar/index';
import { messages } from '../../messages';
import { FormattedMessage } from 'react-intl';
import Item from '@atlaskit/item';

interface Props {
  spaceAvatar: string;
  spaceTitle: string;
  isDisabled?: boolean;
  onFilter: (isFilterOn: boolean) => any;
}

export default class ConfluenceSpaceFilter extends React.Component<Props> {
  state = {
    isChecked: false,
  };

  toggleCheckbox() {
    const { isChecked } = this.state;
    this.props.onFilter(!isChecked);
    this.setState({
      isChecked: !isChecked,
    });
  }

  getIcons() {
    const { isDisabled, spaceAvatar } = this.props;

    return (
      <React.Fragment>
        <Checkbox isChecked={this.state.isChecked} isDisabled={isDisabled} />
        <Avatar
          borderColor="transparent"
          src={spaceAvatar}
          appearance="square"
          size="small"
          isDisabled={isDisabled}
        />
      </React.Fragment>
    );
  }

  render() {
    const { isDisabled, spaceTitle } = this.props;

    return (
      <ResultItemGroup
        title={<FormattedMessage {...messages.confluence_space_filter} />}
      >
        <Item
          onClick={() => this.toggleCheckbox()}
          elemBefore={this.getIcons()}
          isCompact
          isDisabled={isDisabled}
        >
          {spaceTitle}
        </Item>
      </ResultItemGroup>
    );
  }
}
