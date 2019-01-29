// @flow
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

/**
 * Convert a hex colour code to RGBA.
 * @param {String} hex Hex colour code.
 * @param {Number} alpha Optional alpha value (defaults to 1).
 *
 */
const hex2rgba = (hex: string, alpha = 1) => {
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
};

export const background = {
  default: {
    default: { light: colors.N20A, dark: colors.DN70 },
    hover: { light: colors.N20A, dark: colors.DN70 },
    active: { light: hex2rgba(colors.B75, 0.6), dark: colors.B75 },
    disabled: { light: colors.N20A, dark: colors.DN70 },
    selected: { light: colors.N700, dark: colors.DN0 },
    focusSelected: { light: colors.N700, dark: colors.DN0 },
  },
  primary: {
    default: { light: colors.B400, dark: colors.B100 },
    hover: { light: colors.N20A, dark: colors.DN70 },
    active: { light: colors.B500, dark: colors.B200 },
    disabled: { light: colors.N20A, dark: colors.DN70 },
    selected: { light: colors.N700, dark: colors.DN0 },
    focusSelected: { light: colors.N700, dark: colors.DN0 },
  },
};

export const color = {
  default: { light: colors.N400, dark: colors.DN400 },
  primary: { light: colors.N0, dark: colors.DN30 },
};

export const Theme = createTheme<ThemeTokens, ThemeProps>(
  ({ appearance = 'default', mode = 'light', state = 'default' }) => ({
    background: background[appearance][state][mode],
    color: color[appearance][mode],
  }),
);
