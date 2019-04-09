import * as React from 'react';
import TextArea from '@atlaskit/textarea';
import { gridSize, fontSize } from '@atlaskit/theme';

import InlineEdit from '../src';
import styled from 'styled-components';

const minRows = 2;
const textAreaLineHeightFactor = 2.5;
const ReadViewContainer = styled.div`
  padding: 8px 8px;
  line-height: ${(gridSize() * textAreaLineHeightFactor) / fontSize()}
  min-height: ${gridSize() * textAreaLineHeightFactor * minRows}px
`;

interface State {
  editValue: string;
}

export default class InlineEditExample extends React.Component<void, State> {
  state = {
    editValue: 'Field Value',
  };

  onConfirm = (value: string) => {
    this.setState({
      editValue: value,
    });
  };

  render() {
    return (
      <div style={{ padding: '0 16px 60px', width: '50%' }}>
        <InlineEdit
          defaultValue={this.state.editValue}
          label="Inline edit textarea + keep edit view open on blur"
          editView={editViewProps => <TextArea {...editViewProps} />}
          readView={() => (
            <ReadViewContainer>
              {this.state.editValue
                ? this.state.editValue.split('\n').map((value, i) => (
                    <React.Fragment key={i}>
                      {value}
                      <br />
                    </React.Fragment>
                  ))
                : 'Click to enter value'}
            </ReadViewContainer>
          )}
          onConfirm={this.onConfirm}
          keepEditViewOpenOnBlur
          readViewFitContainerWidth
        />
      </div>
    );
  }
}
