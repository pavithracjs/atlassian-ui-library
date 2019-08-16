import get from 'lodash.get';
import pickBy from 'lodash.pickby';
import {
  ThemeProps,
  CustomTheme,
  CustomizableStates,
  CustomizableTokens,
  CustomThemeResult,
} from './types';

function getThemedTokens(
  theme: Partial<CustomTheme>,
  scope: keyof CustomTheme,
  state: keyof CustomizableStates,
): Partial<CustomizableTokens> {
  const tokens = {
    background: get(theme, `${scope}.${state}.background`),
    text: get(theme, `${scope}.${state}.text`),
    secondaryText: get(theme, `${scope}.${state}.secondaryText`),
  };

  return pickBy(tokens, key => {
    return key;
  });
}

export const createCustomTheme = (
  customThemeProps: Partial<CustomTheme>,
): CustomThemeResult => {
  const mainBackgroundColor = {
    background: customThemeProps.mainBackgroundColor,
  };
  const itemTheme = (theme: any, props: ThemeProps) => ({
    ...theme(props),
    hover: {
      ...theme(props).hover,
      ...getThemedTokens(customThemeProps, 'item', 'hover'),
    },
    default: {
      ...theme(props).default,
      ...getThemedTokens(customThemeProps, 'item', 'default'),
      ...pickBy(mainBackgroundColor, key => key),
    },
  });

  const childItemTheme = (theme: any, props: ThemeProps) => ({
    ...theme(props),
    hover: {
      ...theme(props).hover,
      ...getThemedTokens(customThemeProps, 'childItem', 'hover'),
    },
    default: {
      ...theme(props).default,
      ...getThemedTokens(customThemeProps, 'childItem', 'default'),
    },
  });

  return {
    itemTheme,
    childItemTheme,
  };
};
