import { CSSProperties as ReactCSSProperties } from 'react';

export type CSSProperties = ReactCSSProperties & {
  backgroundColor: string;
  color: string;
};

export type ModeContext = {
  default: CSSProperties;
  hover: CSSProperties;
  focus: CSSProperties;
  active: CSSProperties;
  subtle: CSSProperties;
};

// This is the shape of a theme 'mode', e.g. light, dark, or custom
export type Mode = {
  primary: ModeContext;
  secondary: ModeContext;
};

export type AppNavigationTheme = {
  mode: Mode;
};
