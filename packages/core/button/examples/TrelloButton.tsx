import * as React from 'react';
import Button from '../src/components/ButtonNew';
import {
  base as nachosBase,
  background,
  borderColor,
  fontWeight,
  color,
  border,
} from '../src/styled/Nachos/styles';

const NButton = nachosProps => (
  <Button
    theme={(adgTheme, { appearance = 'default', state = 'default' }) => ({
      ...adgTheme,
      ...nachosBase,
      background: background[appearance] ? background[appearance][state] : null,
      borderColor: borderColor[appearance]
        ? borderColor[appearance][state]
        : null,
      fontWeight: fontWeight[appearance] ? fontWeight[appearance][state] : null,
      color: color[appearance] ? color[appearance][state] : null,
      border: border[appearance] ? border[appearance][state] : null,
    })}
    {...nachosProps}
  />
);

export default () => (
  <div>
    <h3>Nachos Button</h3>
    <NButton appearance="primary">Nachos</NButton>

    <h3>ADG Button</h3>
    <Button appearance="primary">ADG</Button>
  </div>
);
