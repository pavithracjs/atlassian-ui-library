import { colors } from '@atlaskit/theme';
import nachosColors from './colors';

export const nachosBase = {
  paddingTop: '6px',
  paddingBottom: '6px',
  paddingLeft: '12px',
  paddingRight: '12px',
};

export const background = {
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
  disabled: {
    default: colors.N30,
  },
};

export const borderColor = {
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
};

export const fontWeight = {
  default: {
    default: 'bold',
  },
  subtle: {
    default: 'normal',
  },
  disabled: {
    default: 'normal',
  },
};

export const color = {
  default: {
    active: colors.N0,
  },
  disabled: {
    default: colors.N30,
  },
};

export const border = {
  subtle: {
    hover: 'none',
    active: 'none',
  },
  disabled: {
    default: 'none',
  },
};
