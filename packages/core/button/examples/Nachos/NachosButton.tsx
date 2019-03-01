import * as React from 'react';
import getButtonStyles from './styles';
import Button from '../../src/components/Button';

type Props = React.ComponentProps<typeof Button> & {
  children?: React.ReactNode;
};

export default (props: Props) => (
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
