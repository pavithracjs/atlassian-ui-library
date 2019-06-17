import * as React from 'react';
import Checkbox from '@atlaskit/checkbox/Checkbox';
import Avatar from '@atlaskit/avatar/index';
import Item from '@atlaskit/item';

export interface Props {
  spaceAvatar: string;
  spaceTitle: string;
  isDisabled?: boolean;
  onFilterChanged(isFilterOn: boolean): void;
}

interface State {
  isChecked: boolean;
}

export default class ConfluenceSpaceFilter extends React.Component<
  Props,
  State
> {
  state = {
    isChecked: false,
  };

  toggleCheckbox = () => {
    const { isChecked } = this.state;
    this.props.onFilterChanged(!isChecked);
    this.setState({
      isChecked: !isChecked,
    });
  };

  getIcons() {
    const { isDisabled, spaceAvatar } = this.props;

    return (
      <>
        <Checkbox isChecked={this.state.isChecked} isDisabled={isDisabled} />
        <Avatar
          borderColor="transparent"
          src={spaceAvatar}
          appearance="square"
          size="small"
          isDisabled={isDisabled}
        />
      </>
    );
  }

  render() {
    const { isDisabled, spaceTitle } = this.props;

    return (
      <Item
        onClick={this.toggleCheckbox}
        elemBefore={this.getIcons()}
        isCompact
        isDisabled={isDisabled}
      >
        {spaceTitle}
      </Item>
    );
  }
}
