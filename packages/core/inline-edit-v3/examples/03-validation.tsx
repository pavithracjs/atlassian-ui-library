import * as React from 'react';
import TextField from '@atlaskit/textfield';

import InlineEdit from '../src';
import ReadViewContainer from './styled/ReadViewContainer';
import { FieldProps } from '../src/types';

type State = {
  editValue: string;
  isEditing: boolean;
  onEventResult: string;
};

export default class InlineEditExample extends React.Component<void, State> {
  editViewRef: { current: null | HTMLInputElement };

  constructor() {
    super();
    this.state = {
      isEditing: false,
      editValue: 'Field Value',
      onEventResult: 'Click on a field above to show edit view',
    };

    this.editViewRef = React.createRef();
  }

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
      if (this.editViewRef.current) this.editViewRef.current.focus();
    });
  };

  render() {
    return (
      <div style={{ padding: '0 16px' }}>
        <InlineEdit
          defaultValue={this.state.editValue}
          label="Inline Edit Field"
          editView={(fieldProps: FieldProps) => (
            <TextField {...fieldProps} ref={this.editViewRef} />
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
          validate={(value: string) => {
            if (value.length < 4) {
              return 'Not long enough';
            }
            return undefined;
          }}
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
