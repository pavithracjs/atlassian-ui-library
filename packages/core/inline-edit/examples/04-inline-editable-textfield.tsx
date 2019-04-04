import * as React from 'react';

import { InlineEditableTextfield } from '../src';

interface State {
  editValue: string;
}

export default class InlineEditExample extends React.Component<void, State> {
  state = {
    editValue: 'Field value',
  };

  render() {
    return (
      <div style={{ padding: '0 16px 60px' }}>
        <InlineEditableTextfield
          defaultValue={this.state.editValue}
          label="Inline editable textfield"
          onConfirm={value => this.setState({ editValue: value })}
          placeholder="Click to enter text"
        />
      </div>
    );
  }
}
