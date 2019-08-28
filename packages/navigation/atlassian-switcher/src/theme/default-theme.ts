import * as colors from '@atlaskit/theme/colors';
import { gridSize, createTheme } from '@atlaskit/theme';
import { ThemeProps, ThemeTokens, ThemingPublicApi } from './types';

export const defaultThemingColors: ThemingPublicApi = {
  primaryTextColor: colors.text,
  secondaryTextColor: colors.N200,
  primaryHoverBackgroundColor: colors.N30,
  secondaryHoverBackgroundColor: colors.N20,
};

const defaultTopLevelItemWrapperTheme = (
  props: ThemingPublicApi = defaultThemingColors,
) => {
  return {
    hover: {
      background: defaultThemingColors.secondaryHoverBackgroundColor,
    },
  };
};

const defaultItemTheme = (props: ThemingPublicApi = defaultThemingColors) => {
  const gridSizeResult = gridSize();
  return {
    display: 'block',
    padding: {
      default: {
        bottom: gridSizeResult,
        top: gridSizeResult,
        left: gridSizeResult,
        right: gridSizeResult,
      },
    },
    hover: {
      background: defaultThemingColors.primaryHoverBackgroundColor,
    },
    default: {
      background: 'transparent',
      text: defaultThemingColors.primaryTextColor,
      secondaryText: defaultThemingColors.secondaryTextColor,
    },
    active: {
      background: 'transparent',
    },
    width: {
      default: '100%',
    },
  };
};

const defaultChildItemTheme = (
  props: ThemingPublicApi = defaultThemingColors,
) => {
  const defaultItemThemeResult = defaultItemTheme(props);
  const gridSizeResult = gridSize();
  return {
    padding: {
      default: {
        left: gridSizeResult,
        right: gridSizeResult,
        bottom: gridSizeResult / 2,
        top: gridSizeResult / 2,
      },
    },
    hover: {
      ...defaultItemThemeResult.hover,
    },
    active: {
      background: 'transparent',
    },
    default: {
      ...defaultItemThemeResult.default,
      background: defaultThemingColors.secondaryHoverBackgroundColor,
    },
  };
};

export const TopLevelItemWrapperTheme = createTheme<
  Partial<ThemeTokens>,
  ThemeProps
>(defaultTopLevelItemWrapperTheme);
export const ItemTheme = createTheme<Partial<ThemeTokens>, ThemeProps>(
  defaultItemTheme,
);
export const ChildItemTheme = createTheme<Partial<ThemeTokens>, ThemeProps>(
  defaultChildItemTheme,
);
