import { colors } from '@atlaskit/theme';
import { nachosColors } from './colors';

export type NachosAppearances =
  | 'default'
  | 'primary'
  | 'subtle'
  | 'danger'
  | 'disabled';

type NachosThemeProps = {
  appearance: NachosAppearances;
  state: string;
};

type NachosProperty = {
  [key: string]: any;
};

export const button = {
  background: {
    default: {
      default: colors.N30,
      hover: colors.N40,
      active: colors.N800,
    },
    primary: {
      default: nachosColors['green-600'],
      hover: nachosColors['green-700'],
      active: nachosColors['green-800'],
    },
    subtle: {
      default: colors.N20A,
      hover: colors.N30A,
      active: colors.N50A,
    },
    danger: {
      default: nachosColors['red-600'],
      hover: nachosColors['red-700'],
      active: nachosColors['red-800'],
    },
    disabled: colors.N30,
  },
  boxShadow: {
    default: {
      default: `0 1px 0 0 ${colors.N40A}`,
      hover: `0 1px 0 0 ${colors.N50A}`,
      active: 'none',
    },
    primary: `0 1px 0 0 ${nachosColors['green-900']}`,
    subtle: 'none',
    danger: `0 1px 0 0 ${nachosColors['red-900']}`,
    disabled: 'none',
  },
  borderColor: {
    default: {
      default: colors.N40A,
      hover: colors.N50A,
      active: colors.N900,
    },
    primary: {
      default: nachosColors['green-900'],
      hover: nachosColors['green-900'],
      active: nachosColors['green-900'],
    },
    danger: {
      default: nachosColors['red-900'],
      hover: nachosColors['red-900'],
      active: nachosColors['red-900'],
    },
  },
  fontWeight: {
    default: 'bold',
    subtle: 'normal',
    disabled: 'normal',
  },
  color: {
    default: {
      default: colors.N700,
      active: colors.N0,
    },
    primary: colors.N0,
    subtle: colors.N700,
    danger: colors.N0,
    disabled: colors.N70,
  },
  border: 'none',
  cursor: {
    default: 'pointer',
    disabled: 'not-allowed',
  },
};

const getBackground = (
  background: NachosProperty,
  { appearance, state }: NachosThemeProps,
) => {
  if (appearance === 'disabled') return background[appearance];

  if (!background[appearance]) {
    return background.default[state];
  }
  return background[appearance][state];
};

const getBoxShadow = (
  boxShadow: NachosProperty,
  { appearance, state }: NachosThemeProps,
) => {
  if (appearance === 'default') return boxShadow[appearance][state];
  return boxShadow[appearance];
};

const getBorderColor = (
  borderColor: NachosProperty,
  { appearance, state }: NachosThemeProps,
) => {
  if (!borderColor[appearance] || !borderColor[appearance][state]) {
    return borderColor.default.default;
  }
  return borderColor[appearance][state];
};

const getFontWeight = (
  fontWeight: NachosProperty,
  { appearance }: NachosThemeProps,
) => {
  if (!fontWeight[appearance]) return fontWeight.default;
  return fontWeight[appearance];
};

const getCursor = (
  cursor: NachosProperty,
  { appearance }: NachosThemeProps,
) => {
  if (!cursor[appearance]) return cursor.default;
  return cursor[appearance];
};

const getColor = (
  color: NachosProperty,
  { appearance, state }: NachosThemeProps,
) => {
  if (appearance === 'default') {
    if (!color[appearance][state]) {
      return color.default.default;
    }
    return color[appearance][state];
  }
  if (!color[appearance]) {
    return color.default.default;
  }
  return color[appearance];
};

export default (props: NachosThemeProps) => ({
  border: button.border,
  background: getBackground(button.background, props),
  borderColor: getBorderColor(button.borderColor, props),
  boxShadow: getBoxShadow(button.boxShadow, props),
  color: getColor(button.color, props),
  cursor: getCursor(button.cursor, props),
  fontWeight: getFontWeight(button.fontWeight, props),
});
