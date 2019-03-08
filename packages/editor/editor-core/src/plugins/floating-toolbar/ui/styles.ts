import { colors } from '@atlaskit/theme';
import { hexToRgba } from '@atlaskit/editor-common';

const background = {
  // Do we have to define every appearance in order for this to work?
  // Otherwise how do we get the STATES for each appearance.
  // ie, check out the appearance state right now - not good.
  danger: {
    default: { light: 'inherit', dark: 'inherit' },
    hover: { light: colors.N30A, dark: colors.N30A },
    active: {
      light: hexToRgba(colors.B75, 0.6),
      dark: hexToRgba(colors.B75, 0.6),
    },
  },
};

const color = {
  // Do we have to define every appearance in order for this to work?
  // Otherwise how do we get the STATES for each appearance.
  // ie, check out the appearance state right now - not good.
  danger: {
    default: { light: 'inherit', dark: 'inherit' },
    hover: { light: colors.R300, dark: colors.R300 },
    active: { light: colors.R300, dark: colors.R300 },
  },
};

const getStyles = (
  property,
  { appearance = 'default', state = 'default', mode = 'light' },
) => {
  if (!property[appearance] || !property[appearance][state]) {
    return 'initial';
  }
  return color[appearance][state][mode];
};

export const getButtonStyles = (props: any) => ({
  padding: '0 2px',
  background: getStyles(background, props),
  color: getStyles(color, props),
  '&[href]': {
    padding: '0 2px',
  },
});
