import { ThemeProps, ThemeTokens } from '@atlaskit/button/types';
import { gridSize as gridSizeFn } from '@atlaskit/theme/constants';
import { AppNavigationTheme } from '../../theme';

const gridSize = gridSizeFn();

export const margin = {
  left: gridSize / 2,
};

export const padding = {
  all: gridSize / 2,
};

export const getIconButtonTheme = ({
  mode: { iconButton },
}: AppNavigationTheme) => (
  current: (props: ThemeProps) => ThemeTokens,
  props: ThemeProps,
): ThemeTokens => {
  const { buttonStyles, spinnerStyles } = current(props);
  return {
    buttonStyles: {
      ...buttonStyles,
      display: 'flex',
      height: 'auto',
      marginLeft: margin.left,
      padding: padding.all,
      ...iconButton.default,
      ':hover': iconButton.hover,
      ':focus': iconButton.focus,
      ':active': iconButton.active,
    },
    spinnerStyles,
  };
};
