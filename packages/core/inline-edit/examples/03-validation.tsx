import * as React from 'react';
import TextField from '@atlaskit/textfield';
import ErrorIcon from '@atlaskit/icon/glyph/error';
import { colors } from '@atlaskit/theme';

import InlineEdit from '../src';
import ReadViewContainer from '../src/styled/ReadViewContainer';

type State = {
  editValue: string;
};

export default class InlineEditExample extends React.Component<void, State> {
  state = {
    editValue: 'Field Value',
  };

  validateValue = '';

  validate = (value: string) => {
    this.validateValue = value;
    return new Promise<{ value: string; error: string } | undefined>(
      resolve => {
        setTimeout(() => {
          if (value.length <= 6) {
            resolve({ value, error: 'Enter a value longer than 6 characters' });
          }
          resolve(undefined);
        }, 500);
      },
    ).then(validateObject => {
      if (validateObject && validateObject.value === this.validateValue) {
        return validateObject.error;
      }
      return undefined;
    });
  };

  onConfirm = (value: string) => {
    this.setState({
      editValue: value,
    });
  };

  render() {
    return (
      <div style={{ padding: '0 16px', width: '70%' }}>
        <InlineEdit
          editValue={this.state.editValue}
          label="Inline edit validation"
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
          readView={() => (
            <ReadViewContainer>
              {this.state.editValue || 'Click to enter value'}
            </ReadViewContainer>
          )}
          onConfirm={this.onConfirm}
          validate={this.validate}
        />
      </div>
    );
  }
}
