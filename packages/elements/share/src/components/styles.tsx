import * as React from 'react';
import Button, { ButtonProps } from '@atlaskit/button';

export default (props: ButtonProps) => (
  <Button
    {...props}
    theme={(currentTheme: any, themeProps: any) => {
      const { buttonStyles, ...rest } = currentTheme(themeProps);
      return {
        buttonStyles: {
          ...buttonStyles,
          padding: 0,
          '& > span > span:first-child': {
            margin: '0 !important',
          },
        },
        ...rest,
      };
    }}
  />
);
