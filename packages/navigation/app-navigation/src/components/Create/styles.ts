import { ThemeProps, ThemeTokens } from '@atlaskit/button/types';
import {
  fontSizeSmall,
  gridSize as gridSizeFn,
} from '@atlaskit/theme/constants';
import styled from '@emotion/styled';
import {
  actionSectionDesktopStyles,
  actionSectionMobileStyles,
  globalSkeletonStyles,
} from '../../common/styles';
import { AppNavigationTheme } from '../../theme';
import { SecondaryButtonSkeleton } from '../IconButton';

const gridSize = gridSizeFn();

const buttonHeight = gridSize * 4;

export const createButtonStyles = actionSectionDesktopStyles;

export const createIconStyles = actionSectionMobileStyles;

export const getCreateButtonTheme = ({
  mode: { secondary },
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
      ...secondary.default,
      ':hover': secondary.hover,
      ':focus': secondary.focus,
      ':active': secondary.active,
    },
    spinnerStyles,
  };
};

export const ButtonSkeleton = styled.div`
  height: ${buttonHeight}px;
  width: 68px;
  border-radius: 3px;
  ${createButtonStyles}
  ${globalSkeletonStyles}
`;

export const IconButtonSkeleton = styled(SecondaryButtonSkeleton)`
  width: ${gridSize * 3.25}px;
  height: ${gridSize * 3.25}px;
  ${createIconStyles}
`;
