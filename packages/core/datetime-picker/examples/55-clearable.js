// @flow

import React, { Component, type Node } from 'react';
import { Label } from '@atlaskit/field-base';
import { DatePicker, DateTimePicker, TimePicker } from '../src';

type Props = {
  initialValue?: string,
  initialIsOpen?: boolean,
  children: ({
    value: string,
    onValueChange: (value: string) => void,
    isOpen: boolean,
    onBlur: () => void,
  }) => Node,
};

type State = {
  value: string,
  isOpen: boolean,
};

class Controlled extends Component<Props, State> {
  state: State;

  recentlySelected: boolean = false;

  constructor(props: Props) {
    super(props);
    this.state = {
      value: props.initialValue || '',
      isOpen: props.initialIsOpen || false,
    };
  }

  handleClick = () => {
    if (!this.recentlySelected) {
      this.setState({ isOpen: true });
    }
  };

  onValueChange = (value: string) => {
    console.log(value);
    this.recentlySelected = true;
    this.setState(
      {
        value,
        isOpen: false,
      },
      () => {
        setTimeout(() => {
          this.recentlySelected = false;
        }, 200);
      },
    );
  };

  onBlur = () => {
    this.setState({
      isOpen: false,
    });
  };

  onFocus = () => {
    this.setState({
      isOpen: false,
    });
  };

  onClear = () => {
    console.log('Cleared');

    this.onValueChange('');
  };

  render() {
    return (
      // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/click-events-have-key-events
      <div onClick={this.handleClick}>
        {this.props.children({
          value: this.state.value,
          onValueChange: this.onValueChange,
          onClear: this.onClear,
          isOpen: this.state.isOpen,
          onBlur: this.onBlur,
        })}
      </div>
    );
  }
}

const onChange = value => {
  console.log(value);
};

const onClear = () => {
  console.log('Cleared');
};

export default () => {
  return (
    <div>
      <h3>Date picker - uncontrolled</h3>
      <Label htmlFor="react-select-datepicker-1--input" label="default" />
      <DatePicker
        id="datepicker-1"
        onChange={onChange}
        onClear={onClear}
        selectProps={{ isClearable: true }}
      />

      <h3>Date picker - controlled</h3>
      <Label
        htmlFor="react-select-datepicker-2--input"
        label="controlled (value)"
      />
      <Controlled initialValue="2018-01-02">
        {({ value, onValueChange, onBlur }) => (
          <DatePicker
            id="datepicker-2"
            value={value}
            onChange={onValueChange}
            onBlur={onBlur}
            selectProps={{ isClearable: true }}
          />
        )}
      </Controlled>
    </div>
  );
};
