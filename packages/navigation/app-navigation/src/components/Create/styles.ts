import { B500, B75 } from '@atlaskit/theme/colors';
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
import { SecondaryButtonSkeleton } from '../IconButton';

const gridSize = gridSizeFn();

const buttonHeight = gridSize * 4;

const buttonOverrides = {
  backgroundColor: B75,
  color: B500,
  fontSize: fontSizeSmall(),
  fontWeight: 'bold',
  height: buttonHeight,
  textTransform: 'uppercase',
};

export const buttonTheme: any = (
  currentTheme: Function,
  themeProps: { appearance: string },
) => {
  const { buttonStyles, spinnerStyles } = currentTheme(themeProps);
  return {
    buttonStyles: {
      ...buttonStyles,
      ...buttonOverrides,
    },
    spinnerStyles,
  };
};

export const createButtonStyles = actionSectionDesktopStyles;

export const createIconStyles = actionSectionMobileStyles;

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
