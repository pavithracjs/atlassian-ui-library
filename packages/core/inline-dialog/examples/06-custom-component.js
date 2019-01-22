// @flow
import React, { Component } from 'react';
import Button from '@atlaskit/button';
import styled from 'styled-components';
import InlineDialog from '../src';

type State = {
  dialogOpen: boolean,
};

const content = (
  <div>
    <p>Custom Container Component</p>
  </div>
);

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 80px;
  min-width: 600px;
  background: linear-gradient(to left, #e66465, #e66499);
  border-radius: 5px;
  color: #fff;
`;

export default class InlineDialogExample extends Component<{}, State> {
  state = {
    dialogOpen: true,
  };

  toggleDialog = () => this.setState({ dialogOpen: !this.state.dialogOpen });

  render() {
    return (
      <div style={{ minHeight: '120px' }}>
        <InlineDialog
          onClose={() => {
            this.setState({ dialogOpen: false });
          }}
          content={content}
          isOpen={this.state.dialogOpen}
          components={{ Container }}
        >
          <Button
            isSelected={this.state.dialogOpen}
            onClick={this.toggleDialog}
          >
            Click me!
          </Button>
        </InlineDialog>
      </div>
    );
  }
}
