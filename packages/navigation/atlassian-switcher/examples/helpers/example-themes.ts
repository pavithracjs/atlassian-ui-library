import * as colors from '@atlaskit/theme/colors';
import { createCustomTheme } from '../../src/theme/theme-builder';

export const redTheme = createCustomTheme({
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
      secondaryText: colors.R200,
    },
    default: {
      text: colors.R500,
      background: colors.R50,
    },
  },
});
