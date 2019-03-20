import * as React from 'react';
import Select from '@atlaskit/select';
import Group from '@atlaskit/tag-group';
import Tag from '@atlaskit/tag';

import InlineEdit from '../src';
import ReadViewContainer from '../src/styled/ReadViewContainer';

interface Option {
  label: string;
  value: string;
}

const selectOptions: Option[] = [
  { label: 'Apple', value: 'Apple' },
  { label: 'Banana', value: 'Banana' },
  { label: 'Cherry', value: 'Cherry' },
  { label: 'Mango', value: 'Mango' },
  { label: 'Orange', value: 'Orange' },
  { label: 'Strawberry', value: 'Strawberry' },
  { label: 'Watermelon', value: 'Watermelon' },
];

type State = {
  editValue: Option[];
  isEditing: boolean;
};

export default class InlineEditExample extends React.Component<void, State> {
  editViewRef: HTMLInputElement | undefined;

  state = {
    isEditing: false,
    editValue: [],
  };

  onConfirm = (value: Option[]) => {
    this.setState({
      editValue: value,
      isEditing: false,
    });
  };

  onCancel = () => {
    this.setState({ isEditing: false });
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
      <div style={{ padding: '0 16px' }}>
        <InlineEdit
          defaultValue={this.state.editValue}
          label="Inline Edit Field"
          editView={fieldProps => (
            <Select
              {...fieldProps}
              options={selectOptions}
              isMulti
              autoFocus
              openMenuOnFocus
            />
          )}
          readView={
            this.state.editValue.length === 0 ? (
              <ReadViewContainer>Click to enter value</ReadViewContainer>
            ) : (
              <Group>
                {this.state.editValue.map((option: Option) => (
                  <Tag text={option.label} key={option.label} />
                ))}
              </Group>
            )
          }
          onConfirm={this.onConfirm}
          onCancel={this.onCancel}
          isEditing={this.state.isEditing}
          onEditRequested={this.onEditRequested}
        />
      </div>
    );
  }
}
