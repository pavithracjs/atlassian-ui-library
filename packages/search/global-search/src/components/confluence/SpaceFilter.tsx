import * as React from 'react';
import Checkbox from '@atlaskit/checkbox/Checkbox';
import Avatar from '@atlaskit/avatar/index';
import baseItem, { withItemFocus } from '@atlaskit/item';
import { Filter, FilterType } from '../../api/CrossProductSearchClient';

const Item = withItemFocus(baseItem);

export interface Props {
  spaceAvatar: string;
  spaceTitle: string;
  spaceKey: string;
  isDisabled?: boolean;
  isFilterOn?: boolean;
  onFilterChanged(filter: Filter[]): void;
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

  generateFilter = (): Filter[] => {
    const { isChecked } = this.state;
    return isChecked
      ? []
      : [
          {
            '@type': FilterType.Spaces,
            spaceKeys: [this.props.spaceKey],
          },
        ];
  };

  toggleCheckbox = () => {
    const { isChecked } = this.state;
    const filter = this.generateFilter();
    this.props.onFilterChanged(filter);
    this.setState({
      isChecked: !isChecked,
    });
  };

  handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleCheckbox();
    }
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

  static getDerivedStateFromProps(props: Props, state: State) {
    if (state.isChecked !== props.isFilterOn) {
      return { isChecked: props.isFilterOn };
    }
    return null;
  }

  render() {
    const { isDisabled, spaceTitle } = this.props;

    return (
      <Item
        onClick={this.toggleCheckbox}
        onKeyDown={this.handleKeyDown}
        elemBefore={this.getIcons()}
        isCompact
        isDisabled={isDisabled}
      >
        {spaceTitle}
      </Item>
    );
  }
}
