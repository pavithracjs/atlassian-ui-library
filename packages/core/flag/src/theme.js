// @flow
import { colors, themed, gridSize } from '@atlaskit/theme';

export const flagBackgroundColor = themed('appearance', {
  error: { light: colors.R400, dark: colors.R300 },
  info: { light: colors.N500, dark: colors.N500 },
  normal: { light: colors.N0, dark: colors.DN50 },
  success: { light: colors.G400, dark: colors.G300 },
  warning: { light: colors.Y200, dark: colors.Y300 },
});

export const flagBorderColor = themed('appearance', {
  // $FlowFixMe - theme is not found in props
  normal: { light: colors.N60A },
});

export const flagTextColor = themed('appearance', {
  error: { light: colors.N0, dark: colors.DN40 },
  info: { light: colors.N0, dark: colors.DN600 },
  normal: { light: colors.N500, dark: colors.DN600 },
  success: { light: colors.N0, dark: colors.DN40 },
  warning: { light: colors.N700, dark: colors.DN40 },
});

export const flagShadowColor = themed('appearance', {
  error: { light: colors.N50A, dark: colors.N50A },
  info: { light: colors.N50A, dark: colors.N50A },
  normal: { light: colors.N50A, dark: colors.N50A },
  success: { light: colors.N50A, dark: colors.N50A },
  warning: { light: colors.N50A, dark: colors.N50A },
});
// $FlowFixMe - theme is not found in props
export const flagFocusRingColor = themed('appearance', {
  error: { light: colors.N40, dark: colors.N40 },
  info: { light: colors.N40, dark: colors.N40 },
  normal: { light: colors.B100, dark: colors.link },
  success: { light: colors.N40, dark: colors.N40 },
  warning: { light: colors.N200, dark: colors.N200 },
});

const lightButtonBackground = 'rgba(255, 255, 255, 0.08)';

export const background = {
  success: { light: lightButtonBackground, dark: colors.N30A },
  info: { light: lightButtonBackground, dark: lightButtonBackground },
  error: { light: lightButtonBackground, dark: colors.N30A },
  warning: { light: colors.N30A, dark: colors.N30A },
  normal: { light: 'none', dark: 'none' },
};

export const color = {
  success: { light: colors.N0, dark: colors.DN40 },
  info: { light: colors.N0, dark: colors.DN600 },
  error: { light: colors.N0, dark: colors.DN600 },
  warning: { light: colors.N700, dark: colors.DN40 },
  normal: { light: colors.B400, dark: colors.B100 },
};

const getBackground = ({ appearance = 'normal', mode = 'light' }) =>
  background[appearance][mode];
const getColor = ({ appearance = 'normal', mode = 'light' }) =>
  color[appearance][mode];

export const actionButtonStyles = (props: any) => ({
  background: getBackground(props),
  color: getColor(props),
  width: 'auto',
});

export const getPseudos = (p: any) => ({
  '&, a&': {
    fontWeight: '500',
    padding: `0 ${p.appearance === 'normal' ? 0 : gridSize()}px !important`,
  },
  '&:focus': {
    boxShadow: `0 0 0 2px ${flagFocusRingColor(p)}`,
  },
  '&:hover, &:active': {
    textDecoration: 'underline',
  },
});
