import * as React from 'react';
import Textfield from '@atlaskit/textfield';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import { colors } from '@atlaskit/theme';

import InlineEdit from './InlineEdit';
import ReadViewContainer from '../styled/ReadViewContainer';
import ErrorIconContainer from '../styled/ErrorIconContainer';
import { InlineEditableTextfieldProps } from '../types';

class InlineEditableTextfield extends React.Component<
  InlineEditableTextfieldProps,
  {}
> {
  static defaultProps = {
    keepEditViewOpenOnBlur: false,
    hideActionButtons: false,
    readViewFitContainerWidth: false,
    startWithEditViewOpen: false,
    editButtonLabel: 'Edit',
    confirmButtonLabel: 'Confirm',
    cancelButtonLabel: 'Cancel',
    isCompact: false,
  };

  render() {
    const {
      defaultValue,
      isCompact,
      placeholder,
      startWithEditViewOpen,
    } = this.props;
    return (
      <InlineEdit
        {...this.props}
        defaultValue={defaultValue}
        editView={fieldProps => (
          <Textfield
            {...fieldProps}
            elemAfterInput={
              fieldProps.isInvalid && (
                <ErrorIconContainer>
                  <ErrorIcon label="error" primaryColor={colors.R400} />
                </ErrorIconContainer>
              )
            }
            isCompact={isCompact}
            autoFocus
          />
        )}
        readView={() => (
          <ReadViewContainer isCompact={isCompact}>
            {defaultValue || placeholder}
          </ReadViewContainer>
        )}
        startWithEditViewOpen={startWithEditViewOpen}
      />
    );
  }
}

export default InlineEditableTextfield;
