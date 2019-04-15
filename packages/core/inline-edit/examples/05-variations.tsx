import * as React from 'react';
import { gridSize } from '@atlaskit/theme';
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

  onConfirm = (value: string, key: keyof State) => {
    this.setState({
      [key]: value,
    } as Pick<State, keyof State>);
  };

  render() {
    return (
      <div style={{ padding: `${gridSize()}px ${gridSize()}px`, width: '50%' }}>
        <InlineEditableTextfield
          defaultValue={this.state.firstEditValue}
          label="Inline edit textfield + hide action buttons (Enter to confirm, Esc to cancel)"
          onConfirm={value => this.onConfirm(value, 'firstEditValue')}
          placeholder="Click to enter text"
          hideActionButtons
        />
        <InlineEditableTextfield
          defaultValue={this.state.secondEditValue}
          label="Inline edit textfield + start in edit view + isRequired"
          onConfirm={value => this.onConfirm(value, 'secondEditValue')}
          placeholder="Click to enter text"
          startWithEditViewOpen
          isRequired
        />
        <InlineEditableTextfield
          defaultValue={this.state.thirdEditValue}
          label="Inline edit textfield + validation + compact"
          onConfirm={value => this.onConfirm(value, 'thirdEditValue')}
          placeholder="Click to enter text"
          validate={this.validate}
          isCompact
        />
      </div>
    );
  }
}
