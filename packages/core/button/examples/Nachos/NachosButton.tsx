import * as React from 'react';
import { nachosBase, getButtonStyles } from './styles';
import Button from '../../src/components/ButtonNew';
import { ButtonProps, ThemeProps } from '../../src/types';

export default (nachosProps: ButtonProps) => (
  <Button
    theme={(adgTheme: Function, themeProps: ThemeProps) => ({
      ...adgTheme(themeProps),
      ...nachosBase,
      ...getButtonStyles(themeProps),
    })}
    {...nachosProps}
  />
);
