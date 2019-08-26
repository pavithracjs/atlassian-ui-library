import { colors } from '@atlaskit/theme';
import { createCustomTheme } from '../../src/theme/theme-builder';

export const redTheme = createCustomTheme({
  mainBackgroundColor: colors.N0,
  item: {
    hover: {
      background: colors.R50,
      text: colors.R500,
      secondaryText: colors.R200,
    },
    default: {
      text: colors.R500,
      secondaryText: colors.R200,
    },
  },
  childItem: {
    hover: {
      background: colors.R75,
      text: colors.R500,
      secondaryText: colors.N30,
    },
    default: {
      background: colors.R50,
      text: colors.R500,
    },
  },
});
