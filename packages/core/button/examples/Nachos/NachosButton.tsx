import * as React from 'react';
import getButtonStyles, { NachosAppearances } from './styles';
import Button from '../../src/components/Button';
import { ButtonProps, ThemeProps } from '../../src/types';

export default (nachosProps: ButtonProps) => (
  <Button theme={NachosTheme} {...nachosProps} />
);

export const NachosTheme = (
  adgTheme: Function,
  { appearance = 'default', state = 'default', ...rest }: ThemeProps,
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
};
