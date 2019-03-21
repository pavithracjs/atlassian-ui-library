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
};

export default class InlineEditExample extends React.Component<void, State> {
  state = {
    editValue: [],
  };

  onConfirm = (value: Option[]) => {
    this.setState({
      editValue: value,
    });
  };

  render() {
    return (
      <div style={{ padding: '0 16px' }}>
        <InlineEdit
          defaultValue={this.state.editValue}
          label="Inline edit select"
          editView={editViewProps => (
            <Select
              {...editViewProps}
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
        />
      </div>
    );
  }
}
