import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme';

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
