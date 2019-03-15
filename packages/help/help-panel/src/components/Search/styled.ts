import styled from 'styled-components';
import { gridSize } from '@atlaskit/theme';

export const SearchContainer = styled.div`
  position: relative;
`;

export const SearchList = styled.div`
  padding-top: ${3 * gridSize()}px;
  position: relative;
`;

export const SearchInputIcon = styled.div`
  position: absolute
  right: ${2 * gridSize()}px;
`;
