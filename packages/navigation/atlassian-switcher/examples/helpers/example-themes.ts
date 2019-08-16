import { colors } from '@atlaskit/theme';
import { createCustomTheme } from '../../src/utils/theme-builder';

export const customTheme = createCustomTheme({
  mainBackgroundColor: colors.R75,
  item: {
    hover: {
      background: colors.R500,
      text: colors.R75,
      secondaryText: colors.N30,
    },
    default: {
      text: colors.R500,
      secondaryText: colors.R200,
    },
  },
  childItem: {
    hover: {
      background: colors.R500,
      text: colors.N0,
      secondaryText: colors.N30,
    },
    default: {
      text: colors.R500,
    },
  },
});

export const bloodyItemTheme = customTheme.itemTheme;
export const bloodyChildItemTheme = customTheme.childItemTheme;
