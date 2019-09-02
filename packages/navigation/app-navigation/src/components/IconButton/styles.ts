import { ThemeProps, ThemeTokens } from '@atlaskit/button/types';
import { gridSize as gridSizeFn } from '@atlaskit/theme/constants';
import styled from '@emotion/styled';
import { globalSkeletonStyles } from '../../common/styles';
import { AppNavigationTheme } from '../../theme';
import { IconButtonSkeletonProps } from './types';

const gridSize = gridSizeFn();

const margin = {
  left: gridSize / 2,
};

const padding = {
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

const buttonHeight = gridSize * 4;

export const SecondaryButtonSkeleton = styled.div<IconButtonSkeletonProps>`
  width: ${({ dimension }) =>
    typeof dimension === 'number' ? dimension : buttonHeight}px;
  height: ${({ dimension }) =>
    typeof dimension === 'number' ? dimension : buttonHeight}px;
  border-radius: 50%;
  margin-left: ${({ marginLeft }) =>
    typeof marginLeft === 'number' ? marginLeft : margin.left}px;
  margin-right: ${({ marginRight }) =>
    typeof marginRight === 'number' ? marginRight : 0}px;
  ${globalSkeletonStyles};
`;
