import * as React from 'react';
import { InlineEditableTextfield } from '../src';

interface State {
  firstInlineEdit: string;
  secondInlineEdit: string;
}

export default class InlineEditExample extends React.Component<void, State> {
  state = {
    firstInlineEdit: 'First value',
    secondInlineEdit: 'Second value',
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

  onConfirm = (value: string, stateKey: string) => {
    // @ts-ignore
    this.setState({ [stateKey]: value });
  };

  render() {
    return (
      <div style={{ padding: '0 16px', width: '70%' }}>
        <InlineEditableTextfield
          defaultValue={this.state.firstInlineEdit}
          label="Inline edit textfield"
          onConfirm={value => this.onConfirm(value, 'firstInlineEdit')}
        />
        <InlineEditableTextfield
          defaultValue={this.state.secondInlineEdit}
          label="Inline edit textfield + start in edit view + hide action buttons (Enter to confirm, Esc to cancel) + validation"
          onConfirm={value => this.onConfirm(value, 'secondInlineEdit')}
          validate={this.validate}
          hideActionButtons
          startWithEditViewOpen
        />
      </div>
    );
  }
}
