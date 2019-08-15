import { colors, gridSize, createTheme } from '@atlaskit/theme';

export type ItemStateTokens = {
  background?: string;
  text?: string;
  secondaryText?: string;
};

export type ItemThemeTokens = {
  padding: any;
  hover?: ItemStateTokens;
  default?: ItemStateTokens;
};

export type ThemeProps = {};

export type Themeable<T> = T & { theme?: any };

const defaultItemTheme = (props: ThemeProps) => ({
  display: 'block',
  padding: {
    default: {
      bottom: gridSize(),
      top: gridSize(),
      left: gridSize(),
      right: gridSize(),
    },
  },
  hover: {
    background: 'transparent',
  },
  default: {
    background: 'transparent',
    text: colors.text,
    secondaryText: colors.N200,
  },
});

const defaultChildItemTheme = (props: ThemeProps) => {
  const defaultItemThemeResult = defaultItemTheme(props);
  return {
    padding: {
      default: {
        left: gridSize(),
        right: gridSize(),
        bottom: gridSize() / 2,
        top: gridSize() / 2,
      },
    },
    hover: {
      background: colors.N20A,
    },
    default: {
      ...defaultItemThemeResult.default,
      text: colors.N700,
    },
  };
};

export const ItemTheme = createTheme<ItemThemeTokens, ThemeProps>(
  defaultItemTheme,
);
export const ChildItemTheme = createTheme<ItemThemeTokens, ThemeProps>(
  defaultChildItemTheme,
);
