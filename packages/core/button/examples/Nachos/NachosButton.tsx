import * as React from 'react';
import getButtonStyles from './styles';
import Button from '../../src/components/Button';
import { ButtonProps } from '../../src/types';

export default (props: ButtonProps) => (
  <Button
    theme={(
      adgTheme,
      { appearance = 'default', state = 'default', ...rest },
    ) => {
      const {
        buttonStyles: adgButtonStyles,
        spinnerStyles: adgSpinnerStyles,
        iconStyles: adgIconStyles,
      } = adgTheme({ appearance, state, ...rest });

      return {
        buttonStyles: {
          ...adgButtonStyles,
          ...getButtonStyles({ appearance, state, ...rest }),
        },
        spinnerStyles: {
          ...adgSpinnerStyles,
        },
        iconStyles: {
          ...adgIconStyles,
        },
      };
    }}
    {...props}
  />
);
