import { ThemeProps, ThemeTokens } from '@atlaskit/button/types';
import { gridSize as gridSizeFn } from '@atlaskit/theme/constants';
import styled from '@emotion/styled';
import { globalSkeletonStyles } from '../../common/styles';
import { AppNavigationTheme } from '../../theme';
import { IconButtonSkeletonProps } from './types';

const gridSize = gridSizeFn();

const buttonHeight = gridSize * 4;

const margin = {
  left: gridSize / 2,
};

const padding = {
  all: gridSize / 2,
};

export const getIconButtonTheme = ({
  mode: { primary },
}: AppNavigationTheme) => (
  current: (props: ThemeProps) => ThemeTokens,
  props: ThemeProps,
): ThemeTokens => {
  const { buttonStyles, spinnerStyles } = current(props);
  return {
    buttonStyles: {
      ...buttonStyles,
      backgroundColor: 'transparent',
      color: primary.text.default,
      display: 'inline-flex',
      height: buttonHeight,
      marginLeft: margin.left,
      padding: padding.all,
      ':hover, :focus': {
        backgroundColor: primary.background.static,
      },
    },
    spinnerStyles,
  };
};

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
