import { colors, createTheme } from '@atlaskit/theme';

export type ThemeAppearance = 'default' | 'primary';

export type ThemeMode = 'dark' | 'light';

export type ThemeProps = {
  appearance: ThemeAppearance;
  mode: ThemeMode;
  state: string;
};

export type ThemeTokens = {
  background: string;
  color: string;
};

export const baseTheme = {
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

/**
 * Convert a hex colour code to RGBA.
 * @param {String} hex Hex colour code.
 * @param {Number} alpha Optional alpha value (defaults to 1).
 */
function hex2rgba(hex: string, alpha = 1) {
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    let colorArr = hex.substring(1).split('');

    if (colorArr.length === 3) {
      colorArr = [
        colorArr[0],
        colorArr[0],
        colorArr[1],
        colorArr[1],
        colorArr[2],
        colorArr[2],
      ];
    }

    const color = `0x${colorArr.join('')}`;

    // FIXME: `>>` operand can validly take a string value
    const r = ((color as any) >> 16) & 255;
    const g = ((color as any) >> 8) & 255;
    const b = (color as any) & 255;

    return `rgba(${[r, g, b].join(',')}, ${alpha})`;
  }

  throw new Error('Bad Hex');
}

export function applyPropertyStyle(
  property: string,
  {
    appearance = 'default',
    state = 'default',
    mode,
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

export const Theme = createTheme<ThemeTokens, ThemeProps>(tokens =>
  properties.reduce((acc, p) => {
    acc[p] = applyPropertyStyle(p, tokens, baseTheme);
    return acc;
  }, {}),
);
