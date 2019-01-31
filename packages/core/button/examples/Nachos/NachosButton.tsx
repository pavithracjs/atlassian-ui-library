import * as React from 'react';
import nachosTheme, { nachosBase } from './styles';
import Button from '../../src/components/ButtonNew';
import { ButtonProps, ThemeProps } from '../../src/types';
import { tokenApplicator } from '../../src/components/utils';

const properties = [
  'background',
  'borderColor',
  'fontWeight',
  'color',
  'border',
  'boxShadow',
  'cursor',
];

export default (nachosProps: ButtonProps) => (
  <Button
    theme={(adgTheme: Function, themeProps: ThemeProps) => ({
      ...adgTheme(themeProps),
      ...nachosBase,
      ...tokenApplicator(properties, themeProps, nachosTheme),
    })}
    {...nachosProps}
  />
);
