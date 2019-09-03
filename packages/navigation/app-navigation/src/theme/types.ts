import { CSSObject } from '@emotion/core';

export type CSSProperties = CSSObject & {
  backgroundColor: string;
  color: string;
};

export type ModeContext = {
  default: CSSProperties;
  hover: CSSProperties;
  focus: CSSProperties;
  active: CSSProperties;
};

// This is the shape of a theme 'mode', e.g. light, dark, or custom
export type Mode = {
  create: ModeContext;
  iconButton: ModeContext;
  navigation: CSSProperties;
  search: CSSProperties;
  skeleton: CSSObject & { backgroundColor: string };
  primaryButton: ModeContext;
};

export type AppNavigationTheme = {
  mode: Mode;
};
