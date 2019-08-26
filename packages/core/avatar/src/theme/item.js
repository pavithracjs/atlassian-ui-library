// @flow

import { createTheme } from '@atlaskit/theme/components';

export type ThemeItemTokens = {
  backgroundColor: string,
};

export const ThemeItem = createTheme<ThemeItemTokens, {}>(() => {
  return {
    backgroundColor: '',
  };
});
