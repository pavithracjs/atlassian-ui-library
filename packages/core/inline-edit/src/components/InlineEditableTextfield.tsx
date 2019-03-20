import * as React from 'react';
import TextField from '@atlaskit/textfield';
import { withDefaultProps } from '@atlaskit/type-helpers';

import InlineEdit from './InlineEdit';
import ReadViewContainer from '../styled/ReadViewContainer';
import { InlineEditableTextfieldProps } from '../types';

type State = {
  isEditing: boolean;
};

const defaultProps: Pick<
  InlineEditableTextfieldProps,
  | 'disableConfirmOnBlur'
  | 'hideActionButtons'
  | 'readViewFitContainerWidth'
  | 'emptyValueText'
> = {
  disableConfirmOnBlur: false,
  hideActionButtons: false,
  readViewFitContainerWidth: false,
  emptyValueText: 'Click to enter text',
};

class InlineEditableTextfield extends React.Component<
  InlineEditableTextfieldProps,
  State
> {
  editViewRef: HTMLInputElement | undefined;

  state = {
    isEditing: false,
  };

  onConfirm = (value: string) => {
    this.setState({
      isEditing: false,
    });
    this.props.onConfirm(value);
  };

  onCancel = () => {
    this.setState({
      isEditing: false,
    });
  };

  onEditRequested = () => {
    this.setState({ isEditing: true }, () => {
      if (this.editViewRef) {
        this.editViewRef.focus();
      }
    });
  };

  render() {
    return (
      <InlineEdit
        {...this.props}
        defaultValue={this.props.defaultValue}
        editView={fieldProps => (
          <TextField
            {...fieldProps}
            ref={(ref: HTMLInputElement) => {
              this.editViewRef = ref;
            }}
          />
        )}
        readView={
          <ReadViewContainer>
            {this.props.defaultValue || this.props.emptyValueText}
          </ReadViewContainer>
        }
        onConfirm={this.onConfirm}
        onCancel={this.onCancel}
        isEditing={this.state.isEditing}
        onEditRequested={this.onEditRequested}
      />
    );
  }
}

export default withDefaultProps(defaultProps, InlineEditableTextfield);
