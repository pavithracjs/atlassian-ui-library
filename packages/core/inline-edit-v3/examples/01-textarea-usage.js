// @flow
import React, { Component } from 'react';
import TextArea from '@atlaskit/textarea';

import InlineEdit from '../src';
import ReadViewContainer from './styled/ReadViewContainer';

type State = {
  editValue: string,
  isEditing: boolean,
  onEventResult: string,
};

export default class BasicExample extends Component<void, State> {
  editViewRef: HTMLTextAreaElement | null;

  state = {
    isEditing: false,
    editValue: 'Field Value',
    onEventResult: 'Click on a field above to show edit view',
  };

  onConfirm = (value: string) => {
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
    if (this.editViewRef) {
      this.editViewRef.focus();
    }
  };

  render() {
    return (
      <div style={{ padding: '0 16px' }}>
        <InlineEdit
          defaultValue={this.state.editValue}
          label="Inline Edit Field"
          editView={fieldProps => (
            <TextArea
              {...fieldProps}
              ref={(ref: any) => {
                this.editViewRef = ref;
              }}
            />
          )}
          readView={
            <ReadViewContainer>
              {this.state.editValue || 'Click to enter value'}
            </ReadViewContainer>
          }
          onConfirm={this.onConfirm}
          onCancel={this.onCancel}
          isEditing={this.state.isEditing}
          onEditRequested={this.onEditRequested}
          disableConfirmOnBlur
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
