import * as React from 'react';
import { colors } from '@atlaskit/theme';
import Button from '../src';

const nachosBase = {
  paddingTop: '6px',
  paddingBottom: '6px',
  paddingLeft: '12px',
  paddingRight: '12px',
};

const background = {
  default: { light: colors.N30, dark: 'black' },
  primary: { light: colors.G300, dark: 'black' },
};

const borderColor = {
  default: { light: colors.N40A, dark: 'black' },
  primary: { light: colors.G500, dark: 'black' },
};

const NButton = nProps => (
  <Button
    theme={(adgTheme, { appearance, mode }) => ({
      ...adgTheme,
      ...nachosBase,
      background: background[appearance][mode],
      borderColor: borderColor[appearance][mode],
    })}
    {...nProps}
  />
);

export default () => (
  <div>
    <h3>Nachos Button</h3>
    <NButton appearance="primary">Nachos</NButton>

    {/* <h3>ADG Button</h3>
    <Button>ADG</Button> */}
  </div>
);
