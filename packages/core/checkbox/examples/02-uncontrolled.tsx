import * as React from 'react';
import { Checkbox } from '../src';

type State = {
  onChangeResult: string;
};

export default class UncontrolledExample extends React.PureComponent<
  void,
  State
> {
  state = {
    onChangeResult: 'Check & Uncheck to trigger onChange',
  };
  onChange: React.FocusEventHandler<HTMLInputElement> = event => {
    this.setState({
      onChangeResult: `this.state.isChecked: ${String(
        event.currentTarget.checked,
      )}`,
    });
  };

  render() {
    return (
      <div>
        <Checkbox
          onChange={this.onChange}
          label="Uncontrolled Checkbox"
          value="Uncontrolled Checkbox"
          name="uncontrolled-checkbox"
        />

        <div
          style={{
            borderStyle: 'dashed',
            borderWidth: '1px',
            borderColor: '#ccc',
            padding: '0.5em',
            margin: '0.5em',
            color: '#ccc',
          }}
        >
          {this.state.onChangeResult}
        </div>
      </div>
    );
  }
}
