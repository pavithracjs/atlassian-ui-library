import * as React from 'react';
import TextField from '@atlaskit/textfield';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import { colors } from '@atlaskit/theme';

import InlineEdit from '../src';
import ReadViewContainer from '../src/styled/ReadViewContainer';
import { FieldProps } from '../src/types';

type State = {
  editValue: string;
  isEditing: boolean;
  onEventResult: string;
};

export default class InlineEditExample extends React.Component<void, State> {
  editViewRef: HTMLInputElement | undefined;

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
    this.setState({ isEditing: true }, () => {
      if (this.editViewRef) this.editViewRef.focus();
    });
  };

  render() {
    return (
      <div style={{ padding: '0 16px', width: '70%' }}>
        <InlineEdit
          defaultValue={this.state.editValue}
          label="Inline Edit Field"
          editView={(fieldProps: FieldProps, isInvalid) => (
            <TextField
              {...fieldProps}
              ref={(ref: HTMLInputElement) => {
                this.editViewRef = ref;
              }}
              elemAfterInput={
                isInvalid && (
                  <div style={{ paddingRight: '6px', lineHeight: '100%' }}>
                    <ErrorIcon label="error" primaryColor={colors.R400} />
                  </div>
                )
              }
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
          validate={(value: string) =>
            new Promise(resolve => {
              setTimeout(() => {
                if (value.length <= 6) {
                  resolve('Enter a value longer than 6 characters');
                }
                resolve(undefined);
              }, 500);
            })
          }
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
