import * as React from 'react';
import TextField from '@atlaskit/textfield';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import { colors } from '@atlaskit/theme';

import InlineEdit from './InlineEdit';
import ReadViewContainer from '../styled/ReadViewContainer';
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
      editValue,
      isCompact,
      placeholder,
      startWithEditViewOpen,
    } = this.props;
    return (
      <InlineEdit
        {...this.props}
        editValue={editValue}
        editView={editViewProps => (
          <TextField
            {...editViewProps}
            elemAfterInput={
              editViewProps.isInvalid && (
                <div style={{ paddingRight: '6px', lineHeight: '100%' }}>
                  <ErrorIcon label="error" primaryColor={colors.R400} />
                </div>
              )
            }
            isCompact={isCompact}
          />
        )}
        readView={() => (
          <ReadViewContainer isCompact={isCompact}>
            {editValue || placeholder}
          </ReadViewContainer>
        )}
        startWithEditViewOpen={startWithEditViewOpen}
      />
    );
  }
}

export default InlineEditableTextfield;
