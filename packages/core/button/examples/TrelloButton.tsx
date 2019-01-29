import * as React from 'react';
import { colors } from '@atlaskit/theme';
import Button from '../src/components/ButtonNew';

const nachosBase = {
  paddingTop: '6px',
  paddingBottom: '6px',
  paddingLeft: '12px',
  paddingRight: '12px',
};

const background = {
  default: {
    default: { light: colors.N30, dark: 'black' },
    hover: { light: colors.N20A, dark: colors.DN70 },
    active: { light: colors.B500, dark: colors.B200 },
    disabled: { light: colors.N20A, dark: colors.DN70 },
    selected: { light: colors.N700, dark: colors.DN0 },
    focusSelected: { light: colors.N700, dark: colors.DN0 },
  },
  primary: {
    default: { light: colors.G300, dark: 'black' },
    hover: { light: colors.N20A, dark: colors.DN70 },
    active: { light: colors.B500, dark: colors.B200 },
    disabled: { light: colors.N20A, dark: colors.DN70 },
    selected: { light: colors.N700, dark: colors.DN0 },
    focusSelected: { light: colors.N700, dark: colors.DN0 },
  },
};

const borderColor = {
  default: { light: colors.N40A, dark: 'black' },
  primary: { light: colors.G500, dark: 'black' },
};

const NButton = nachosProps => (
  <Button
    theme={(adgTheme, { appearance, mode, state }) => ({
      ...adgTheme,
      ...nachosBase,
      background: background[appearance][state][mode],
      borderColor: borderColor[appearance][mode],
    })}
    {...nachosProps}
  />
);

export default () => (
  <div>
    <h3>Nachos Button</h3>
    <NButton appearance="primary" isDisabled>
      Nachos
    </NButton>

    <h3>ADG Button</h3>
    <Button appearance="primary" isDisabled>
      ADG
    </Button>
  </div>
);
