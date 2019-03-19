//@flow
import React from 'react';
import Button, { ButtonProps } from '@atlaskit/button';
import { gridSize } from '@atlaskit/theme';

export default (props: ButtonProps) => (
  <Button
    {...props}
    theme={(currentTheme, themeProps) => {
      const { buttonStyles, ...rest } = currentTheme(themeProps);
      const halfGridSize = gridSize() / 2;
      return {
        buttonStyles: {
          ...buttonStyles,
          paddingLeft: `${halfGridSize}px`,
          paddingRight: `${halfGridSize}px`,
          'html[dir=rtl] &': {
            transform: 'rotate(180deg)',
          },
        },
        ...rest,
      }
    }}
  />
);
