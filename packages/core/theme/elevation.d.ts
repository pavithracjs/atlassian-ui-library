declare module '@atlaskit/theme/elevation' {
  import * as React from 'react';

  type ThemedResult = () => {
    light: string;
    dark: string;
  };

  export const e100: ThemedResult;
  export const e200: ThemedResult;
  export const e300: ThemedResult;
  export const e400: ThemedResult;
  export const e500: ThemedResult;
}
