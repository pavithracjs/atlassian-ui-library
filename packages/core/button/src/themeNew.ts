import { colors, createTheme } from '@atlaskit/theme';
import { tokenApplicator } from './components/utils';
import { hex2rgba } from './styled/utils';
import { BaseTheme, ThemeProps, ThemeTokens } from './types';
import getButtonStyles from './styled/getButtonStylesUnified';

export const baseTheme: BaseTheme = {
  background: {
    default: {
      default: { light: colors.N20A, dark: colors.DN70 },
      hover: { light: colors.N30A, dark: colors.DN60 },
      active: { light: hex2rgba(colors.B75, 0.6), dark: colors.B75 },
      disabled: { light: colors.N20A, dark: colors.DN70 },
      selected: { light: colors.N700, dark: colors.DN0 },
      focusSelected: { light: colors.N700, dark: colors.DN0 },
    },
    primary: {
      default: { light: colors.B400, dark: colors.B100 },
      hover: { light: colors.B300, dark: colors.B75 },
      active: { light: colors.B500, dark: colors.B200 },
      disabled: { light: colors.N20A, dark: colors.DN70 },
      selected: { light: colors.N700, dark: colors.DN0 },
      focusSelected: { light: colors.N700, dark: colors.DN0 },
    },
  },
  color: {
    default: {
      default: { light: colors.N400, dark: colors.DN400 },
      active: { light: colors.B400, dark: colors.B400 },
      disabled: { light: colors.N70, dark: colors.DN30 },
      selected: { light: colors.N20, dark: colors.DN400 },
      focusSelected: { light: colors.N20, dark: colors.DN400 },
    },
    primary: {
      default: { light: colors.N0, dark: colors.DN30 },
      disabled: { light: colors.N70, dark: colors.DN30 },
      selected: { light: colors.N20, dark: colors.DN400 },
      focusSelected: { light: colors.N20, dark: colors.DN400 },
    },
  },
};

export function applyPropertyStyle(
  property: string,
  {
    appearance = 'default',
    state = 'default',
    mode = 'light',
  }: { appearance: string; state: string; mode: string },
  theme: any,
) {
  const propertyStyles = theme[property];
  if (!propertyStyles) return; // TODO fallback pls.

  // Check for relevant fallbacks.
  if (!propertyStyles[appearance]) {
    if (!propertyStyles['default']) return 'none'; // TODO fallback pls.
    appearance = 'default';
  }

  // If there is no 'state' key (ie, 'hover') defined for a given appearance,
  // return the 'default' state of that appearance.
  if (!propertyStyles[appearance][state]) state = 'default';

  const appearanceStyles = propertyStyles[appearance];
  const stateStyles = appearanceStyles[state];

  return stateStyles[mode] || appearanceStyles.default[mode];
}

const properties = ['color', 'background'];
export const Theme = createTheme<ThemeTokens, ThemeProps>(themeProps => {
  console.log('themeProps output', getButtonStyles(themeProps));
  console.log(
    'tokenApplicator output',
    tokenApplicator(properties, themeProps, baseTheme),
  );
  return {
    ...getButtonStyles(themeProps),
    ...tokenApplicator(properties, themeProps, baseTheme),
  };
});
