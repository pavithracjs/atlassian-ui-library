import * as React from 'react';
import getButtonStyles from './styles';
import Button, { WithDefaultProps } from '../../src/components/Button';
import { ButtonProps } from '../../src/types';

type T = ButtonProps & { children?: React.ReactNode };
type DF = WithDefaultProps<T, typeof Button.defaultProps>;

export default (props: DF) => (
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
