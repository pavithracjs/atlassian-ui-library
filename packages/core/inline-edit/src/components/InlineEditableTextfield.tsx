import * as React from 'react';
import TextField from '@atlaskit/textfield';
import { withDefaultProps } from '@atlaskit/type-helpers';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import { colors } from '@atlaskit/theme';

import InlineEdit from './InlineEdit';
import ReadViewContainer from '../styled/ReadViewContainer';
import { InlineEditableTextfieldProps } from '../types';

const defaultProps: Pick<
  InlineEditableTextfieldProps,
  | 'disableConfirmOnBlur'
  | 'hideActionButtons'
  | 'readViewFitContainerWidth'
  | 'emptyValueText'
  | 'startInEditView'
> = {
  disableConfirmOnBlur: false,
  hideActionButtons: false,
  readViewFitContainerWidth: false,
  emptyValueText: 'Click to enter text',
  startInEditView: false,
};

class InlineEditableTextfield extends React.Component<
  InlineEditableTextfieldProps,
  {}
> {
  onConfirm = (value: string) => {
    this.props.onConfirm(value);
  };

  render() {
    const { defaultValue, emptyValueText, startInEditView } = this.props;
    return (
      <InlineEdit
        {...this.props}
        defaultValue={defaultValue}
        editView={(editViewProps, isInvalid) => (
          <TextField
            {...editViewProps}
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
            {defaultValue || emptyValueText}
          </ReadViewContainer>
        }
        onConfirm={this.onConfirm}
        startInEditView={startInEditView}
      />
    );
  }
}

export default withDefaultProps(defaultProps, InlineEditableTextfield);
