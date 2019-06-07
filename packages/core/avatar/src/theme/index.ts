import { colors, createTheme, gridSize } from '@atlaskit/theme';
import { AppearanceType, PresenceType, SizeType } from '../types';

interface Dimensions {
  height: string;
  width: string;
};

interface Layout {
  // We have to specify all corners as optional because either bottom or top
  // and left or right could be specified.
  bottom?: string;
  left?: string;
  right?: string;
  top?: string;

  // Must be specified every time.
  height: string;
  width: string;
};

enum ThemeMode {
  LIGHT = 'light',
  DARK = 'dark',
}

enum Sizes {
  XSMALL = 'xsmall',
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
  XLARGE = 'xlarge',
  XXLARGE = 'xxlarge',
}

export interface ThemeProps {
  appearance?: AppearanceType;
  includeBorderWidth?: boolean;
  isLoading?: boolean;
  presence?: PresenceType;
  size?: SizeType;
  mode?: ThemeMode;
};

export interface ThemeTokens {
  backgroundColor: string;
  borderRadius: string;
  dimensions: Dimensions;
  presence: Layout;
  status: Layout;
};

const gridSizeValue: number = gridSize();

const AVATAR_SIZES: SizeType = {
  xsmall: gridSizeValue * 2,
  small: gridSizeValue * 3,
  medium: gridSizeValue * 4,
  large: gridSizeValue * 5,
  xlarge: gridSizeValue * 12,
  xxlarge: gridSizeValue * 16,
};

// border radius only applies to "square" avatars
const AVATAR_RADIUS: SizeType = {
  xsmall: 2,
  small: 2,
  medium: 3,
  large: 3,
  xlarge: 6,
  xxlarge: 12,
};

const BORDER_WIDTH: SizeType = {
  xsmall: 2,
  small: 2,
  medium: 2,
  large: 2,
  xlarge: 2,
  xxlarge: 2,
};

const ICON_SIZES: SizeType = {
  xsmall: 0,
  small: 12,
  medium: 14,
  large: 15,
  xlarge: 18,
  xxlarge: 0,
};

const ICON_OFFSET: SizeType = {
  xsmall: 0,
  small: 0,
  medium: 0,
  large: 1,
  xlarge: 7,
  xxlarge: 0,
};

const SQUARE_ICON_OFFSET: SizeType = {
  xsmall: 0,
  small: 0,
  medium: 0,
  large: 0,
  xlarge: 1,
  xxlarge: 0,
};

function getBackgroundColor(props: {
  isLoading: boolean;
  mode: ThemeMode;
}): string {
  const backgroundColors = {
    light: colors.N40,
    dark: colors.DN50,
  };
  return props.isLoading ? backgroundColors[props.mode] : 'transparent';
}

function getBorderRadius(props: {
  appearance: AppearanceType;
  includeBorderWidth: boolean;
  size: keyof SizeType;
}): string {
  const borderWidth = props.includeBorderWidth ? BORDER_WIDTH[props.size] : 0;
  const borderRadius =
    props.appearance === AppearanceType.CIRCLE
      ? '50%'
      : `${AVATAR_RADIUS[props.size] + borderWidth}px`;
  return borderRadius;
}

function getDimensions(props: {
  includeBorderWidth: boolean;
  size: keyof SizeType;
}): Dimensions {
  const borderWidth: number = props.includeBorderWidth
    ? BORDER_WIDTH[props.size] * 2
    : 0;
  const size: number = AVATAR_SIZES[props.size] + borderWidth;
  const width = `${size}px`;
  const height = width;
  return { height, width };
}

const getPresenceLayout = (props: {
  appearance: AppearanceType;
  size: keyof SizeType;
}): Layout => {
  const presencePosition =
    props.appearance === AppearanceType.SQUARE
      ? -(BORDER_WIDTH[props.size] * 2)
      : ICON_OFFSET[props.size];
  const presenceSize = ICON_SIZES[props.size];

  return {
    bottom: `${presencePosition}px`,
    height: `${presenceSize}px`,
    right: `${presencePosition}px`,
    width: `${presenceSize}px`,
  };
};

const getStatusLayout = (props: {
  appearance: AppearanceType;
  size: keyof SizeType;
}): Layout => {
  const statusPosition =
    props.appearance === AppearanceType.SQUARE
      ? SQUARE_ICON_OFFSET[props.size]
      : ICON_OFFSET[props.size];
  const statusSize = ICON_SIZES[props.size];

  return {
    height: `${statusSize}px`,
    right: `${statusPosition}px`,
    top: `${statusPosition}px`,
    width: `${statusSize}px`,
  };
};

const propsDefaults = {
  appearance: AppearanceType.CIRCLE,
  includeBorderWidth: false,
  isLoading: false,
  mode: ThemeMode.LIGHT,
  presence: 'offline',
  size: Sizes.XSMALL,
};

export const Theme = createTheme<ThemeTokens, ThemeProps>(props => {
  const propsWithDefaults = { ...propsDefaults, ...props };
  return {
    backgroundColor: getBackgroundColor(propsWithDefaults),
    borderRadius: getBorderRadius(propsWithDefaults),
    dimensions: getDimensions(propsWithDefaults),
    presence: getPresenceLayout(propsWithDefaults),
    status: getStatusLayout(propsWithDefaults),
  };
});
