declare module '@atlaskit/theme/components' {
  import * as React from 'react';

  const GlobalTheme: Theme<GlobalThemeTokens, any>;
  export default GlobalTheme;

  export type ThemeProp<ThemeTokens, ThemeProps> = (
    themeFn: (ThemeProps: ThemeProps) => ThemeTokens,
    themeProps: ThemeProps,
  ) => ThemeTokens;

  export interface Theme<ThemeTokens, ThemeProps> {
    Consumer: React.ComponentType<
      ThemeProps & {
        children: (tokens: ThemeTokens) => React.ReactElement<ThemeProps>;
      }
    >;
    Provider: React.ComponentType<{
      value?: ThemeProp<ThemeTokens, ThemeProps>;
      children?: React.ReactNode;
    }>;
  }

  export const createTheme: <ThemeTokens, ThemeProps>(
    theme: (props: ThemeProps) => ThemeTokens,
  ) => Theme<ThemeTokens, ThemeProps>;
}
