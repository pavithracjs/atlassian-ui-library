import * as React from 'react';
import styled from 'styled-components';
import Button from '../src/components/Button';
import NButton from './Nachos/NachosButton';

const ButtonWrapper = styled.div`
  display: flex;
  width: 120px;
  margin: 10px;
  height: 200px;
  flex-wrap: wrap;
`;

export default () => (
  <div style={{ margin: 20 }}>
    <ButtonWrapper>
      <NButton appearance="default">Button</NButton>
      <NButton appearance="primary">Button</NButton>
      <NButton appearance="subtle">Button</NButton>
      <NButton appearance="danger">Button</NButton>
      {/* <NButton appearance="disabled">Button</NButton> */}
    </ButtonWrapper>
    <h3>ADG Button</h3>
    <ButtonWrapper>
      <Button appearance="default">Button</Button>
      <Button appearance="primary">Button</Button>
      <Button appearance="subtle-link">Button</Button>
      <Button appearance="warning">Button</Button>
      <Button isDisabled appearance="warning">
        Button
      </Button>
    </ButtonWrapper>
  </div>
);
