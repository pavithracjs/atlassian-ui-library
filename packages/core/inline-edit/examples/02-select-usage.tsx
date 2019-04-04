import * as React from 'react';
import styled from 'styled-components';
import Select from '@atlaskit/select';
import Group from '@atlaskit/tag-group';
import Tag from '@atlaskit/tag';
import { gridSize, fontSize } from '@atlaskit/theme';

import InlineEdit from '../src';

const ReadViewContainer = styled.div`
  display: flex;
  max-width: 100%;
  overflow: hidden;
  padding: 8px 6px;
  font-size: ${fontSize()}px;
  height: ${(gridSize() * 2.5) / fontSize()}em;
  line-height: ${(gridSize() * 2.5) / fontSize()};
`;

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
      <div style={{ padding: '0 16px 8px' }}>
        <InlineEdit
          editValue={this.state.editValue}
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
          readView={() =>
            this.state.editValue.length === 0 ? (
              <ReadViewContainer>Click to choose options</ReadViewContainer>
            ) : (
              <div style={{ padding: '4px' }}>
                <Group>
                  {this.state.editValue.map((option: Option) => (
                    <Tag text={option.label} key={option.label} />
                  ))}
                </Group>
              </div>
            )
          }
          onConfirm={this.onConfirm}
          hideActionButtons
        />
      </div>
    );
  }
}
