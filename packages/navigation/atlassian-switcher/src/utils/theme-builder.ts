import get from 'lodash.get';
import pickBy from 'lodash.pickby';
import { ThemeProps, ThemeTokens } from '../theme';

export type CustomizableStates = {
  default?: CustomizableTokens;
  hover?: CustomizableTokens;
};

type CustomizableTokens = {
  background?: string;
  text?: string;
  secondaryText?: string;
};

type CustomTheme = {
  mainBackgroundColor?: string;
  item: CustomizableStates;
  childItem: CustomizableStates;
};

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

type ThemeFn = (theme: any, props: ThemeProps) => ThemeTokens;
export type CustomThemeResult = { itemTheme: ThemeFn; childItemTheme: ThemeFn };

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
