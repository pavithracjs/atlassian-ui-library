import { ThemeProps, ThemeTokens } from '@atlaskit/button/types';
import {
  fontSizeSmall,
  gridSize as gridSizeFn,
} from '@atlaskit/theme/constants';
import {
  actionSectionDesktopStyles,
  actionSectionMobileStyles,
  skeletonStyles,
} from '../../common/styles';
import { AppNavigationTheme } from '../../theme';

const gridSize = gridSizeFn();

const buttonHeight = gridSize * 4;

export const createButtonStyles = actionSectionDesktopStyles;

export const createButtonSkeletonStyles = (theme: AppNavigationTheme) => ({
  height: `${buttonHeight}px`,
  width: '68px',
  borderRadius: '3px',
  ...skeletonStyles(theme),
  ...createButtonStyles,
});

export const createIconStyles = actionSectionMobileStyles;
export const createIconSkeletonStyles = createIconStyles;

export const getCreateButtonTheme = ({
  mode: { create },
}: AppNavigationTheme) => (
  current: (props: ThemeProps) => ThemeTokens,
  props: ThemeProps,
) => {
  const { buttonStyles, spinnerStyles } = current(props);
  return {
    buttonStyles: {
      ...buttonStyles,
      fontSize: fontSizeSmall(),
      fontWeight: 'bold',
      height: buttonHeight,
      textTransform: 'uppercase',
      ...create.default,
      ':hover': create.hover,
      ':focus': create.focus,
      ':active': create.active,
    },
    spinnerStyles,
  };
};
