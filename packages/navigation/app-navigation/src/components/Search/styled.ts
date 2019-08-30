import { B400, B50 } from '@atlaskit/theme/colors';
import { fontSize, gridSize as gridSizeFn } from '@atlaskit/theme/constants';
import styled from '@emotion/styled';
import { css, SerializedStyles } from '@emotion/core';
import { globalSkeletonStyles } from '../../common/styles';

const gridSize = gridSizeFn();

const searchCommonStyles = css`
  width: 220px;
  height: ${gridSize * 4}px;
  outline: none;
  border-radius: ${gridSize * 2}px;
  border: none;
  box-sizing: border-box;
  padding: 0 ${gridSize}px 0 40px;
`;

export const SearchInput = styled.input`
  background: ${B400};
  color: ${B50};
  font-size: ${fontSize()}px;
  ::placeholder {
    color: ${B50};
  }
  ${searchCommonStyles}
`;

export const SearchInputSkeleton = styled.div`
  margin-right: 6px;
  ${searchCommonStyles}
  ${globalSkeletonStyles}
`;

export const SearchWrapper = styled.div<{ css: SerializedStyles }>`
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
