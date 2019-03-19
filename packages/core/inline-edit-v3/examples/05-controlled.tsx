import * as React from 'react';
import InlineEditableTextfield from '../src/components/InlineEditableTextfield';

interface State {
  editValue: string;
}

export default class InlineEditExample extends React.Component<void, State> {
  state = {
    editValue: 'Initial Value',
  };

  onConfirm = (value: string) => {
    this.setState({ editValue: value });
  };

  render() {
    return (
      <div style={{ padding: '0 16px' }}>
        <InlineEditableTextfield
          defaultValue={this.state.editValue}
          label="Inline Edit Field"
          onConfirm={this.onConfirm}
        />
      </div>
    );
  }
}
