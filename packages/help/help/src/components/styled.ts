/** @jsx jsx */
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { gridSize } from '@atlaskit/theme/constants';
import * as colors from '@atlaskit/theme/colors';

export const truncate = (width: string = '100%') => css`
  overflow-x: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: ${width};
`;

export const HelpBody = styled.div`
  flex: 1;
  flex-direction: column;
  padding: ${gridSize() * 2}px ${gridSize() * 3}px ${gridSize() * 2}px
    ${gridSize() * 3}px;
  height: calc(100vh - 60px - ${gridSize() * 2}px);
  overflow-x: hidden;
  overflow-y: auto;
`;

const ItemGroupTitleSize = 11;
export const ItemGroupTitle = styled.div`
  color: ${colors.N200};
  font-size: ${ItemGroupTitleSize}px;
  line-height: ${(gridSize() * 2) / ItemGroupTitleSize};
  font-weight: 600;
  padding-bottom: ${gridSize()}px;
  ${truncate()}
`;
