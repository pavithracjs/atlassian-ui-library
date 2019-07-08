import React, { Component } from 'react';
import ToggleStateless from './ToggleStateless';
import defaultBaseProps from './defaultBaseProps';
import { StatefulProps, DefaultBaseProps } from './types';

interface DefaultProps extends DefaultBaseProps {
  isDefaultChecked: boolean;
}

interface State {
  isChecked: boolean;
}

// This component is a thin wrapper around the stateless component that manages
// the isChecked state for you
export default class Toggle extends Component<StatefulProps, State> {
  static defaultProps: DefaultProps = {
    ...defaultBaseProps,
    isDefaultChecked: false,
  };

  state: State = {
    isChecked: this.props.isDefaultChecked,
  };

  onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ isChecked: !this.state.isChecked });
    this.props.onChange(event);
  };

  render() {
    return (
      <ToggleStateless
        {...this.props}
        isChecked={this.state.isChecked}
        onChange={this.onChange}
      />
    );
  }
}
