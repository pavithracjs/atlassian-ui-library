import * as React from 'react';
import getButtonStyles from './styles';
import Button from '../../src/components/Button';
import { ButtonProps } from '../../src/types';

export default (props: ButtonProps) => (
  <Button
    theme={(adgTheme, { appearance = 'default', state = 'default' }) => {
      const {
        buttonStyles: adgButtonStyles,
        spinnerStyles: adgSpinnerStyles,
        iconStyles: adgIconStyles,
      } = adgTheme({ appearance, state, ...props });

      return {
        buttonStyles: {
          ...adgButtonStyles,
          ...getButtonStyles({ appearance, state, ...props }),
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
