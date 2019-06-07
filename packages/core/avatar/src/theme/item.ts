import { createTheme } from '@atlaskit/theme';

export interface ThemeItemTokens {
  backgroundColor: string;
};

export const ThemeItem = createTheme<ThemeItemTokens, {}>(() => {
  return {
    backgroundColor: '',
  };
});
