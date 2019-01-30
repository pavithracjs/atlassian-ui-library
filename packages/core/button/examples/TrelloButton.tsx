import * as React from 'react';
import Button from '../src/components/ButtonNew';
import nachosTheme, { nachosBase } from '../src/styled/Nachos/styles';
import { applyPropertyStyle } from '../src/themeNew';
import styled from 'styled-components';

const ButtonWrapper = styled.div`
  margin: 10px;
  width: 80px;
  height: 200px;
  display: flex;
  flex-wrap: wrap;
`;

const properties = [
  'background',
  'borderColor',
  'fontWeight',
  'color',
  'border',
  'boxShadow',
];

const NButton = nachosProps => (
  <Button
    theme={(adgTheme, tokens) => {
      return {
        ...adgTheme,
        ...nachosBase,
        ...properties.reduce((acc, p) => {
          acc[p] = applyPropertyStyle(p, tokens, nachosTheme);
          return acc;
        }, {}),
      };
    }}
    {...nachosProps}
  />
);

export default () => (
  <div style={{ margin: 20 }}>
    <h3>Nachos Button</h3>
    <ButtonWrapper>
      <NButton appearance="default">Button</NButton>
      <NButton appearance="primary">Button</NButton>
      <NButton appearance="subtle">Button</NButton>
      <NButton appearance="danger">Button</NButton>
      <NButton appearance="disabled">Button</NButton>
    </ButtonWrapper>
    <h3>ADG Button</h3>
    <ButtonWrapper>
      <Button appearance="default">Button</Button>
      <Button appearance="primary">Button</Button>
      <Button appearance="subtle">Button</Button>
      <Button appearance="danger">Button</Button>
      <Button appearance="warning">Button</Button>
    </ButtonWrapper>
  </div>
);
