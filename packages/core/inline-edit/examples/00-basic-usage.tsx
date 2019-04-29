import * as React from 'react';
import styled from 'styled-components';
import Textfield from '@atlaskit/textfield';
import { gridSize, fontSize } from '@atlaskit/theme';

import InlineEdit from '../src';

const ReadViewContainer = styled.div`
  display: flex;
  max-width: 100%;
  overflow: hidden;
  padding: ${gridSize()}px ${gridSize() - 2}px;
  font-size: ${fontSize()}px;
  height: ${(gridSize() * 2.5) / fontSize()}em;
  line-height: ${(gridSize() * 2.5) / fontSize()};
`;

interface State {
  editValue: string;
}

export default class InlineEditExample extends React.Component<void, State> {
  state = {
    editValue: 'Field value',
  };

  render() {
    return (
      <div
        style={{
          padding: `${gridSize()}px ${gridSize()}px ${gridSize() * 6}px`,
        }}
      >
        <InlineEdit
          defaultValue={this.state.editValue}
          label="Inline edit"
          editView={fieldProps => <Textfield {...fieldProps} autoFocus />}
          readView={() => (
            <ReadViewContainer>
              {this.state.editValue || 'Click to enter value'}
            </ReadViewContainer>
          )}
          onConfirm={value => this.setState({ editValue: value })}
        />
      </div>
    );
  }
}
