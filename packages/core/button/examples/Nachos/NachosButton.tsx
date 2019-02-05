import * as React from 'react';
import getButtonStyles from './styles';
import Button from '../../src/components/Button';
import { ButtonProps, ThemeProps } from '../../src/types';

export default (nachosProps: ButtonProps) => (
  <Button
    theme={(
      adgTheme: Function,
      { appearance = 'default', state = 'default' }: ThemeProps,
    ) => {
      const { button: adgButton } = adgTheme({ appearance, state });
      return {
        button: {
          ...adgButton,
          ...getButtonStyles({ appearance, state, ...nachosProps }),
        },
      };
    }}
    {...nachosProps} // spacing,
  />
);
