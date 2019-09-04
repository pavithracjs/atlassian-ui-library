import styled, { css } from 'styled-components';
import { gridSize } from '@atlaskit/theme/constants';
import { h700 } from '@atlaskit/theme/typography';

const truncationStyles = css`
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

interface StyledProps {
  truncate?: boolean;
}

const getTruncationStyles = ({ truncate }: StyledProps) =>
  truncate ? truncationStyles : null;

export const Outer = styled.div`
  margin: ${gridSize() * 3}px 0 ${gridSize() * 2}px 0;
`;

export const StyledTitle = styled.h1`
  ${h700()};
  ${getTruncationStyles} line-height: ${gridSize() * 4}px;
  margin-top: 0;
`;

export const TitleWrapper = styled.div`
  align-items: flex-start;
  display: flex;
  ${({ truncate }: StyledProps) =>
    truncate ? 'flex-wrap: no-wrap;' : 'flex-wrap: wrap;'}
`;

export const TitleContainer = styled.div`
  flex: 1 0 auto;
  ${({ truncate }: StyledProps) => (truncate ? 'flex-shrink: 1;' : null)}
  margin-bottom: ${gridSize()}px;
  max-width: 100%;
  min-width: 0;
`;

export const ActionsWrapper = styled.div`
  flex: 0 0 auto;
  margin-bottom: ${gridSize()}px;
  margin-left: auto;
  max-width: 100%;
  padding-left: ${gridSize() * 4}px;
  text-align: right;
  white-space: nowrap;
`;

export const BottomBarWrapper = styled.div`
  margin-top: ${gridSize() * 2}px;
`;
