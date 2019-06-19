/** @jsx jsx */
import styled from '@emotion/styled';
import { gridSize } from '@atlaskit/theme/constants';

export const SearchContainer = styled.div`
  padding-bottom: ${gridSize() * 3}px;
`;

export const SearchResultsList = styled.div`
  padding-top: ${3 * gridSize()}px;
  position: relative;
`;

export const SearchResultEmptyMessage = styled.div`
  padding-top: ${3 * gridSize()}px;
  text-align: center;
  font-weight: bold;
`;
