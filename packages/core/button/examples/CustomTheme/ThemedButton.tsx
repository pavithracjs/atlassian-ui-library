import * as React from 'react';
import getButtonStyles from './styles';
import Button from '../../src/components/Button';
import { ButtonProps, ThemeProps } from '../../src/types';

export default (customProps: ButtonProps) => (
  <Button
    theme={(
      adgTheme: Function,
      { appearance = 'default', state = 'default' }: ThemeProps,
    ) => {
      const {
        buttonStyles: adgButtonStyles,
        spinnerStyles: adgSpinnerStyles,
        iconStyles: adgIconStyles,
      } = adgTheme({ appearance, state, ...customProps });

      return {
        buttonStyles: {
          ...adgButtonStyles,
          ...getButtonStyles({ appearance, state, ...customProps }),
        },
        spinnerStyles: {
          ...adgSpinnerStyles,
        },
        iconStyles: {
          ...adgIconStyles,
        },
      };
    }}
    {...customProps}
  />
);
