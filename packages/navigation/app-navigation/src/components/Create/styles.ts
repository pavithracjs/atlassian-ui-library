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
