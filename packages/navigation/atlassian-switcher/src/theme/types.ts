export type Appearance = 'drawer' | 'standalone';

export type ThemingPublicApi = {
  primaryTextColor?: string;
  secondaryTextColor?: string;
  primaryHoverBackgroundColor?: string;
  secondaryHoverBackgroundColor?: string;
};

export type ItemStateTokens = {
  background?: string;
  text?: string;
  secondaryText?: string;
};

export type ThemeTokens = {
  padding?: any;
  hover?: ItemStateTokens;
  default?: ItemStateTokens;
  active?: ItemStateTokens;
};

export type ThemeProps = {};

export type CustomizableStates = {
  default?: CustomizableTokens;
  hover?: CustomizableTokens;
  active?: CustomizableTokens;
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

export type ApplyThemeFn = (props: ThemeProps) => ThemeTokens;

type ThemeFn = (theme: ApplyThemeFn, props: ThemeProps) => ThemeTokens;

export type CustomThemeResult = {
  itemTheme: ThemeFn;
  childItemTheme: ThemeFn;
  topLevelItemWrapperTheme: ThemeFn;
};

export type Themeable<T> = T & { theme?: any; appearance?: Appearance };
