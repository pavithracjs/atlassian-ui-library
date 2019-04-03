import * as React from 'react';
import { InlineEditableTextfield } from '../src';

interface State {
  firstEditValue: string;
  secondEditValue: string;
  thirdEditValue: string;
}

export default class InlineEditExample extends React.Component<void, State> {
  state = {
    firstEditValue: 'Field value',
    secondEditValue: 'Field value',
    thirdEditValue: 'Field value',
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
          editValue={this.state.firstEditValue}
          label="Inline edit textfield + hide action buttons (Enter to confirm, Esc to cancel)"
          onConfirm={value => this.onConfirm(value, 'firstEditValue')}
          hideActionButtons
        />
        <InlineEditableTextfield
          editValue={this.state.secondEditValue}
          label="Inline edit textfield + start in edit view"
          onConfirm={value => this.onConfirm(value, 'secondEditValue')}
          startWithEditViewOpen
        />
        <InlineEditableTextfield
          editValue={this.state.thirdEditValue}
          label="Inline edit textfield + validation + compact"
          onConfirm={value => this.onConfirm(value, 'thirdEditValue')}
          validate={this.validate}
          isCompact
        />
      </div>
    );
  }
}
