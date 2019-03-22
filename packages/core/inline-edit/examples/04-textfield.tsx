import * as React from 'react';
import { InlineEditableTextfield } from '../src';

interface State {
  editValue: string;
}

export default class InlineEditExample extends React.Component<void, State> {
  state = {
    editValue: 'Initial Value',
  };

  validateValue = '';

  validate = (value: string) => {
    this.validateValue = value;
    return new Promise<{ value: string; error: string } | undefined>(
      resolve => {
        setTimeout(() => {
          if (value.length <= 6) {
            resolve({ value, error: 'Enter a value longer than 6 characters' });
          }
          resolve(undefined);
        }, 500);
      },
    ).then(validateObject => {
      if (validateObject && validateObject.value === this.validateValue) {
        return validateObject.error;
      }
      return undefined;
    });
  };

  onConfirm = (value: string) => {
    this.setState({ editValue: value });
  };

  render() {
    return (
      <div style={{ padding: '0 16px', width: '70%' }}>
        <InlineEditableTextfield
          defaultValue={this.state.editValue}
          label="Inline edit textfield + hide action buttons (Enter to confirm, Esc to cancel) + validation"
          onConfirm={this.onConfirm}
          validate={this.validate}
          hideActionButtons
        />
        <InlineEditableTextfield
          defaultValue={this.state.editValue}
          label="Inline edit textfield + start in edit view"
          onConfirm={this.onConfirm}
          startInEditView
        />
      </div>
    );
  }
}
