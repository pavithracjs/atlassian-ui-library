// @flow
import * as colors from './colors';
import * as elevation from './elevation';
import * as typography from './typography';
import * as math from './utils/math';
import getTheme from './utils/getTheme';
import themed from './utils/themed';
import AtlaskitThemeProvider from './components/AtlaskitThemeProvider';

export {
  colors,
  elevation,
  typography,
  math,
  getTheme,
  themed,
  AtlaskitThemeProvider,
};
export { default as Appearance } from './components/Appearance';

// backwards-compatible export with old Atlaskit case
export const AtlasKitThemeProvider = AtlaskitThemeProvider;

export {
  FLATTENED,
  CHANNEL,
  DEFAULT_THEME_MODE,
  THEME_MODES,
  borderRadius,
  gridSize,
  fontSize,
  fontSizeSmall,
  fontFamily,
  codeFontFamily,
  focusRing,
  noFocusRing,
  layers,
  assistive,
} from './constants';
export { ResetTheme, Reset } from './components/Reset';
export type { ResetThemeProps, ResetThemeTokens } from './components/Reset';
export { default } from './components/Theme';
export { withTheme } from './hoc';
export { createTheme } from './utils/createTheme';
export type { ThemeProp } from './utils/createTheme';
