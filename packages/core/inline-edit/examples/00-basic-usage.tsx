import * as React from 'react';
import TextField from '@atlaskit/textfield';

import InlineEdit from '../src';
import ReadViewContainer from '../src/styled/ReadViewContainer';

type State = {
  editValue: string;
};

export default class InlineEditExample extends React.Component<void, State> {
  editViewRef: HTMLInputElement | undefined;

  state = {
    editValue: 'Field Value',
  };

  onConfirm = (value: string) => {
    this.setState({
      editValue: value,
    });
  };

  render() {
    return (
      <div style={{ padding: '0 16px' }}>
        <InlineEdit
          defaultValue={this.state.editValue}
          label="Inline edit field"
          editView={editViewProps => <TextField {...editViewProps} />}
          readView={() => (
            <ReadViewContainer>
              {this.state.editValue || 'Click to enter value'}
            </ReadViewContainer>
          )}
          onConfirm={this.onConfirm}
        />
      </div>
    );
  }
}
