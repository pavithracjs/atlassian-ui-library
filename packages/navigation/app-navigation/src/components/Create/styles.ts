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
  mode: { primary },
}: AppNavigationTheme) => (
  current: (props: ThemeProps) => ThemeTokens,
  props: ThemeProps,
) => {
  const { buttonStyles, spinnerStyles } = current(props);
  return {
    buttonStyles: {
      ...buttonStyles,
      backgroundColor: primary.background.hint,
      color: primary.text.default,
      fontSize: fontSizeSmall(),
      fontWeight: 'bold',
      height: buttonHeight,
      textTransform: 'uppercase',
      ':hover, :focus': {
        backgroundColor: primary.background.interact,
      },
      ':active': {
        backgroundColor: primary.background.static,
      },
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
