import * as React from 'react';

export const borderRadius: () => number;
export const codeFontFamily: () => string;
export const noFocusRing: () => string;
export const focusRing: (color: string, outlineWidth: number) => string;
export const colors: Record<string, string>;
export const elevation: any;
export const fontFamily: any;
export const fontSize: any;
export const gridSize: any;
export const layers: Record<string, () => number>;
export const math: any;
export const Theme: React.ComponentType<any>;
export const themed: any;
export const typography: any;

export type ThemeProp = <ThemeTokens, ThemeProps>(
  themeFn: (ThemeProps: ThemeProps) => ThemeTokens,
  themeProps: ThemeProps,
) => ThemeTokens;

export class AtlaskitThemeProvider extends React.Component<ThemeProps> {}

const Theme: {
  Consumer: React.ComponentType<
    ThemeProps & { children: (tokens: ThemeTokens) => React.ReactElement }
  >;
  Provider: React.ComponentType<{
    value?: ThemeProp<ThemeTokens, ThemeProps>;
    children?: React.ReactNode;
  }>;
};

export default Theme;
export const GlobalTheme: Theme;

export const createTheme: <ThemeTokens, ThemeProps>(
  theme: (props: ThemeProps) => ThemeTokens,
) => Theme;
