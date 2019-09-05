import { gridSize } from '@atlaskit/theme/constants';
import { skeletonStyles } from '../../common/styles';
import { styled } from '../../theme';
import { buttonHeight, margin, padding } from './styles';

export const PrimaryButtonSkeleton = styled.div`
  display: inline-flex;
  width: 68px;
  height: ${buttonHeight - padding.all * 2.5}px;
  border-radius: ${gridSize() / 2}px;
  margin-left: ${margin.left + padding.all * 2}px;
  margin-right: 12px;
  ${({ theme }) => skeletonStyles(theme)};
`;
