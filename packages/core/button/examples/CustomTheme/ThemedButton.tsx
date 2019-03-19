import * as React from 'react';
import getButtonStyles from './styles';
import Button from '../../src/components/Button';
import { ButtonProps, ButtonAppearances } from '../../src/types';

export default (props: ButtonProps) => (
  <Button
    {...props}
    theme={(adgTheme, { appearance = 'default', state = 'default' }) => {
      const {
        buttonStyles: adgButtonStyles,
        spinnerStyles: adgSpinnerStyles,
        iconStyles: adgIconStyles,
      } = adgTheme({ ...props, appearance, state });

      return {
        buttonStyles: {
          ...adgButtonStyles,
          ...getButtonStyles({
            ...props,
            appearance: appearance as ButtonAppearances,
            state,
          }),
        },
        spinnerStyles: {
          ...adgSpinnerStyles,
        },
        iconStyles: {
          ...adgIconStyles,
        },
      };
    }}
  />
);
