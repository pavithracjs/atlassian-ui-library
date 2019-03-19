import * as React from 'react';
import getButtonStyles from './styles';
import Button from '../../src/components/Button';
import { ButtonProps, ButtonAppearances } from '../../src/types';

export default (props: ButtonProps) => (
  <Button
    {...props}
    theme={(currentTheme, { appearance = 'default', state = 'default' }) => {
      const { buttonStyles, ...rest } = currentTheme({ ...props, appearance, state });
      return {
        buttonStyles: {
          ...buttonStyles,
          ...getButtonStyles({
            ...props,
            appearance: appearance as ButtonAppearances,
            state,
          }),
        },
        ...rest,
      };
    }}
  />
);
