import * as React from 'react';
import TextField from '@atlaskit/textfield';

import InlineEdit, { InlineEditableTextfield } from '../src';
import ReadViewContainer from '../src/styled/ReadViewContainer';

interface State {
  inlineEditValue: string;
  inlineEditableTextfieldValue: string;
}

export default class InlineEditExample extends React.Component<void, State> {
  state = {
    inlineEditValue: 'Field value',
    inlineEditableTextfieldValue: 'Field value',
  };

  onConfirm = (value: string, key: keyof State) => {
    this.setState({
      [key]: value,
    } as Pick<State, keyof State>);
  };

  render() {
    return (
      <div style={{ padding: '0 16px 60px' }}>
        <InlineEdit
          editValue={this.state.inlineEditValue}
          label="Inline edit"
          editView={editViewProps => <TextField {...editViewProps} />}
          readView={() => (
            <ReadViewContainer>
              {this.state.inlineEditValue || 'Click to enter value'}
            </ReadViewContainer>
          )}
          onConfirm={value => this.onConfirm(value, 'inlineEditValue')}
        />
        <InlineEditableTextfield
          editValue={this.state.inlineEditableTextfieldValue}
          label="Inline editable textfield"
          onConfirm={value =>
            this.onConfirm(value, 'inlineEditableTextfieldValue')
          }
          placeholder="Click to enter text"
        />
      </div>
    );
  }
}
