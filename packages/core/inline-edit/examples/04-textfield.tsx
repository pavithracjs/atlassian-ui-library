import * as React from 'react';
import { InlineEditableTextfield } from '../src';

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
      <div style={{ padding: '0 16px', width: '70%' }}>
        <InlineEditableTextfield
          defaultValue={this.state.editValue}
          label="Inline edit textfield + hide action buttons (Enter to confirm, Esc to cancel) + validation"
          onConfirm={this.onConfirm}
          validate={(value: string) =>
            new Promise(resolve => {
              setTimeout(() => {
                if (value.length <= 6) {
                  resolve('Enter a value longer than 6 characters');
                }
                resolve(undefined);
              }, 300);
            })
          }
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
