import { colors } from '@atlaskit/theme';
import { ThemeProps } from '../../src/theme';

export const bloodyItemTheme = (theme: any, props: ThemeProps) => ({
  ...theme(props),
  hover: {
    ...theme(props).hover,
    background: colors.R500,
    text: colors.N0,
    secondaryText: colors.N30,
  },
  default: {
    ...theme(props).default,
    text: colors.R500,
    secondaryText: colors.R200,
  },
});

export const bloodyChildItemTheme = (theme: any, props: ThemeProps) => ({
  ...theme(props),
  hover: {
    ...theme(props).hover,
    background: colors.R500,
    text: colors.N0,
    secondaryText: colors.N30,
  },
  default: {
    ...theme(props).default,
    text: colors.R500,
  },
});
