import { gridSize as gridSizeFn } from '@atlaskit/theme/constants';
import { skeletonStyles } from '../../common/styles';
import { styled } from '../../theme';
import { margin } from './styles';
import { IconButtonSkeletonProps } from './types';

const buttonHeight = gridSizeFn() * 4;

export const IconButtonSkeleton = styled.div<IconButtonSkeletonProps>`
  width: ${({ dimension: size }) =>
    typeof size === 'number' ? size : buttonHeight}px;
  height: ${({ dimension: size }) =>
    typeof size === 'number' ? size : buttonHeight}px;
  border-radius: 50%;
  margin-left: ${({ marginLeft }) =>
    typeof marginLeft === 'number' ? marginLeft : margin.left}px;
  margin-right: ${({ marginRight }) =>
    typeof marginRight === 'number' ? marginRight : 0}px;
  ${({ theme }) => skeletonStyles(theme)}
`;
