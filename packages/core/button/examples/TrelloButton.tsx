import * as React from 'react';
import Button from '../src/components/ButtonNew';
import nachosTheme, { nachosBase } from '../src/styled/Nachos/styles';
import { applyPropertyStyle } from '../src/themeNew';

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
        ...properties.reduce((acc, v) => {
          acc[v] = applyPropertyStyle(v, tokens, nachosTheme);
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
    <NButton appearance="primary">Button</NButton>

    <h3>ADG Button</h3>
    <Button appearance="default">Button</Button>
  </div>
);
