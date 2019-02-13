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
      const {
        buttonStyles: adgButtonStyles,
        spinnerStyles: adgSpinnerStyles,
        iconStyles: adgIconStyles,
      } = adgTheme({ appearance, state, ...nachosProps });

      return {
        buttonStyles: {
          ...adgButtonStyles,
          ...getButtonStyles({ appearance, state, ...nachosProps }),
        },
        spinnerStyles: {
          ...adgSpinnerStyles,
        },
        iconStyles: {
          ...adgIconStyles,
        },
      };
    }}
    {...nachosProps}
  />
);
