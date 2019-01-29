// @flow
import { colors, createTheme } from '@atlaskit/theme';

export type ThemeAppearance = 'default' | 'primary' | {};

export type ThemeMode = 'dark' | 'light';

export type ThemeProps = {
  appearance: ThemeAppearance;
  mode: ThemeMode;
};

export type ThemeTokens = {
  backgroundColor: string;
};

export const backgroundColors = {
  default: { light: colors.N20, dark: colors.N10 },
  primary: { light: colors.G300, dark: colors.N10 },
};

export const Theme = createTheme<ThemeTokens, ThemeProps>(
  ({ appearance = 'default', mode = 'light' }) => ({
    backgroundColor: backgroundColors[appearance][mode],
    paddingTop: '6px',
    paddingBottom: '6px',
    paddingLeft: '12px',
    paddingRight: '12px',
    ...appearance,
  }),
);
