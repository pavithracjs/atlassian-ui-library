import { colors, codeFontFamily } from '@atlaskit/theme';
import nachosColors from './colors';

export const nachosBase = {
  padding: '6px 12px',
  lineHeight: '20px',
  height: '32px',
};

export default {
  background: {
    default: {
      default: { light: colors.N30 },
      hover: { light: colors.N40 },
      active: { light: colors.N800 },
    },
    primary: {
      default: { light: nachosColors['green-600'] },
      hover: { light: nachosColors['green-700'] },
      active: { light: nachosColors['green-800'] },
    },
    subtle: {
      default: { light: colors.N20A },
      hover: { light: colors.N30A },
      active: { light: colors.N50A },
    },
    danger: {
      default: { light: nachosColors['red-600'] },
      hover: { light: nachosColors['red-700'] },
      active: { light: nachosColors['red-800'] },
    },
    disabled: {
      default: { light: colors.N30 },
    },
  },

  boxShadow: {
    default: {
      default: { light: `0 1px 0 0 ${colors.N40A}` },
      hover: { light: `0 1px 0 0 ${colors.N50A}` },
      active: { light: 'none' },
    },
    primary: {
      default: { light: `0 1px 0 0 ${nachosColors['green-900']}` },
    },
    subtle: {
      default: { light: 'none' },
    },
    danger: {
      default: { light: `0 1px 0 0 ${nachosColors['red-900']}` },
    },
    disabled: {
      default: { light: 'none' },
    },
  },

  borderColor: {
    default: {
      default: { light: colors.N40A },
      hover: { light: colors.N50A },
      active: { light: colors.N900 },
    },
    primary: {
      default: { light: nachosColors['green-900'] },
      hover: { light: nachosColors['green-900'] },
      active: { light: nachosColors['green-900'] },
    },
    danger: {
      default: { light: nachosColors['red-900'] },
      hover: { light: nachosColors['red-900'] },
      active: { light: nachosColors['red-900'] },
    },
  },

  fontWeight: {
    default: {
      default: { light: 'bold' },
    },
    subtle: {
      default: { light: 'normal' },
    },
    disabled: {
      default: { light: 'normal' },
    },
  },

  color: {
    default: {
      default: { light: colors.N700 },
      active: { light: colors.N0 },
    },
    primary: {
      default: { light: colors.N0 },
    },
    subtle: {
      default: { light: colors.N700 },
    },
    danger: {
      default: { light: colors.N0 },
    },
    disabled: {
      default: { light: colors.N70 },
    },
  },

  border: {
    subtle: {
      default: { light: 'none' },
      hover: { light: 'none' },
      active: { light: 'none' },
    },
    disabled: {
      default: { light: 'none' },
    },
  },
};
