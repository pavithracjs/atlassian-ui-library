import styled, { css } from 'styled-components';
import { colors, gridSize, elevation } from '@atlaskit/theme';

const ItemGroupTitleSize = 11;

export const truncate = (width: string = '100%') => css`
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: ${width};
`;

export const CloseButton = styled.div`
  position: absolute;
  bottom ${2 * gridSize()}px;
  left: -${6 * gridSize()}px;
  cursor: pointer;
  border-radius: 100%;
  background-color: ${colors.N800}
  ${elevation.e300};
  height: 32px;
  width: 32px;
`;

export const BackButton = styled.button`
  align-items: center;
  background: 0;
  border: 0;
  color: inherit;
  cursor: pointer;
  display: flex;
  font-size: inherit;
  height: ${5 * gridSize()}px;
  justify-content: left;
  line-height: 1;
  padding: 0 ${2 * gridSize()}px 0 0;
  width: ${10 * gridSize()}px;
`;

export const ItemGroupTitle = styled.div`
  color: ${colors.N200};
  font-size: ${ItemGroupTitleSize}px;
  line-height: ${(gridSize() * 2) / ItemGroupTitleSize};
  font-weight: 600;
  ${truncate()}
`;
