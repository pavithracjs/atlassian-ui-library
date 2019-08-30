import { B400, B50 } from '@atlaskit/theme/colors';
import { fontSize, gridSize as gridSizeFn } from '@atlaskit/theme/constants';
import styled from '@emotion/styled';

const gridSize = gridSizeFn();

export const SearchInput = styled.input`
  width: 220px;
  background: ${B400};
  height: ${gridSize * 4}px;
  outline: none;
  border-radius: ${gridSize * 2}px;
  border: none;
  box-sizing: border-box;
  color: ${B50};
  padding: 0 ${gridSize}px 0 40px;
  font-size: ${fontSize()}px;
  ::placeholder {
    color: ${B50};
  }
`;

export const SearchWrapper = styled.div`
  margin-left: 20px;
  padding-right: ${gridSize}px;
  position: relative;
`;

export const IconWrapper = styled.div`
  position: absolute;
  left: 10px;
  top: 5px;
  width: 20px;
  height: 20px;
  pointer-events: none;
`;
