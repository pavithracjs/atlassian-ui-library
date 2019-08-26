export type Appearance = 'drawer' | 'standalone';

export type ItemStateTokens = {
  background?: string;
  text?: string;
  secondaryText?: string;
};

export type ThemeTokens = {
  padding: any;
  hover?: ItemStateTokens;
  default?: ItemStateTokens;
};

export type ThemeProps = {};

export type CustomizableStates = {
  default?: CustomizableTokens;
  hover?: CustomizableTokens;
};

export type CustomizableTokens = {
  background?: string;
  text?: string;
  secondaryText?: string;
};

export type CustomTheme = {
  mainBackgroundColor?: string;
  item: CustomizableStates;
  childItem: CustomizableStates;
};

type ThemeFn = (theme: any, props: ThemeProps) => ThemeTokens;

export type CustomThemeResult = { itemTheme: ThemeFn; childItemTheme: ThemeFn };

export type Themeable<T> = T & { theme?: any; appearance?: Appearance };
