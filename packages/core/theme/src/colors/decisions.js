// Themed colors
// @flow
import * as colors from './options';
import type { colorPaletteType } from '../types';
import themed from '../utils/themed';

export const background = themed({ light: colors.N0, dark: colors.DN30 });
export const backgroundActive = themed({ light: colors.B50, dark: colors.B75 });
export const backgroundHover = themed({ light: colors.N30, dark: colors.DN70 });
export const backgroundOnLayer = themed({
  light: colors.N0,
  dark: colors.DN50,
});
export const text = themed({ light: colors.N900, dark: colors.DN600 });
export const textHover = themed({ light: colors.N800, dark: colors.DN600 });
export const textActive = themed({ light: colors.B400, dark: colors.B400 });
export const subtleText = themed({ light: colors.N200, dark: colors.DN300 });
export const placeholderText = themed({
  light: colors.N100,
  dark: colors.DN200,
});
export const heading = themed({ light: colors.N800, dark: colors.DN600 });
export const subtleHeading = themed({ light: colors.N200, dark: colors.DN300 });
export const codeBlock = themed({ light: colors.N20, dark: colors.DN50 });
export const link = themed({ light: colors.B400, dark: colors.B100 });
export const linkHover = themed({ light: colors.B300, dark: colors.B200 });
export const linkActive = themed({ light: colors.B500, dark: colors.B100 });
export const linkOutline = themed({ light: colors.B100, dark: colors.B200 });
export const primary = themed({ light: colors.B400, dark: colors.B100 });
export const blue = themed({ light: colors.B400, dark: colors.B100 });
export const teal = themed({ light: colors.T300, dark: colors.T200 });
export const purple = themed({ light: colors.P300, dark: colors.P100 });
export const red = themed({ light: colors.R300, dark: colors.R300 });
export const yellow = themed({ light: colors.Y300, dark: colors.Y300 });
export const green = themed({ light: colors.G300, dark: colors.G300 });

// Jira Portfolio
export const colorPalette8 = [
  { background: colors.N800, text: colors.N0 },
  { background: colors.R400, text: colors.N0 },
  { background: colors.P400, text: colors.P50 },
  { background: colors.B400, text: colors.B75 },
  { background: colors.T300, text: colors.N800 },
  { background: colors.G400, text: colors.N0 },
  { background: colors.Y400, text: colors.N800 },
  { background: colors.N70, text: colors.N800 },
];

export const colorPalette16 = [
  ...colorPalette8,
  { background: colors.N500, text: colors.N0 },
  { background: colors.R100, text: colors.N800 },
  { background: colors.P75, text: colors.N800 },
  { background: colors.B100, text: colors.N800 },
  { background: colors.T100, text: colors.N800 },
  { background: colors.G100, text: colors.G500 },
  { background: colors.Y200, text: colors.N800 },
  { background: colors.N0, text: colors.N800 },
];

export const colorPalette24 = [
  ...colorPalette16,
  { background: colors.N100, text: colors.N0 },
  { background: colors.N40, text: colors.N800 },
  { background: colors.N50, text: colors.R500 },
  { background: colors.P50, text: colors.P500 },
  { background: colors.B50, text: colors.B500 },
  { background: colors.T75, text: colors.N800 },
  { background: colors.G50, text: colors.G500 },
  { background: colors.Y75, text: colors.N800 },
];

export const colorPalette = (palette: colorPaletteType = '8') => {
  switch (palette) {
    case '8':
      return colorPalette8;
    case '16':
      return colorPalette16;
    case '24':
      return colorPalette24;
    default:
      throw new Error('The only available color palette is 8, 16, 24');
  }
};
