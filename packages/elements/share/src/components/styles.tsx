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
          '& > span > span:first-of-type': {
            margin: '0', // This is a workaround for an issue in AtlasKit (https://ecosystem.atlassian.net/browse/AK-3976)
          },
        },
        ...rest,
      };
    }}
  />
);
