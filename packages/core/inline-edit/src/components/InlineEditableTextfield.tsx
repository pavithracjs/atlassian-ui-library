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
  | 'keepEditViewOpenOnBlur'
  | 'hideActionButtons'
  | 'readViewFitContainerWidth'
  | 'emptyValueText'
  | 'startWithEditViewOpen'
> = {
  keepEditViewOpenOnBlur: false,
  hideActionButtons: false,
  readViewFitContainerWidth: false,
  emptyValueText: 'Click to enter text',
  startWithEditViewOpen: false,
};

class InlineEditableTextfield extends React.Component<
  InlineEditableTextfieldProps,
  {}
> {
  onConfirm = (value: string) => {
    this.props.onConfirm(value);
  };

  render() {
    const { defaultValue, emptyValueText, startWithEditViewOpen } = this.props;
    return (
      <InlineEdit
        {...this.props}
        defaultValue={defaultValue}
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
          />
        )}
        readView={
          <ReadViewContainer>
            {defaultValue || emptyValueText}
          </ReadViewContainer>
        }
        onConfirm={this.onConfirm}
        startWithEditViewOpen={startWithEditViewOpen}
      />
    );
  }
}

export default withDefaultProps(defaultProps, InlineEditableTextfield);
