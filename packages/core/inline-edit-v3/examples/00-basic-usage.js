// @flow
import React, { Component } from 'react';
import TextField from '@atlaskit/textfield';

import InlineEdit from '../src';
import ReadViewContainer from './styled/ReadViewContainer';

type State = {
  onEventResult: string,
  editValue: string | number,
};

export default class BasicExample extends Component<void, State> {
  state = {
    isEditing: false,
    editValue: 'Field Value',
    onEventResult: 'Click on a field above to show edit view',
  };

  onConfirm = value => {
    this.setState({
      onEventResult: `onConfirm called with value "${value}"`,
      editValue: value,
      isEditing: false,
    });
  };

  onCancel = () => {
    this.setState({
      onEventResult: `onCancel called`,
      isEditing: false,
    });
  };

  onEditRequested = () => {
    this.setState({ isEditing: true });
  };

  render() {
    return (
      <div style={{ padding: '0 16px' }}>
        <InlineEdit
          defaultValue={this.state.editValue}
          label="Inline Edit Field"
          editView={(fieldProps, ref) => (
            <TextField {...fieldProps} ref={ref} />
          )}
          readView={fieldProps => (
            <ReadViewContainer>{fieldProps.value}</ReadViewContainer>
          )}
          onConfirm={this.onConfirm}
          onCancel={this.onCancel}
          isEditing={this.state.isEditing}
          onEditRequested={this.onEditRequested}
        />

        <div
          style={{
            borderStyle: 'dashed',
            borderWidth: '1px',
            borderColor: '#ccc',
            padding: '0.5em',
            color: '#ccc',
            margin: '0.5em',
          }}
        >
          {this.state.onEventResult}
        </div>
      </div>
    );
  }
}
