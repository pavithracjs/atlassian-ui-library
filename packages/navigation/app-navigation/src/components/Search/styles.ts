import { fontSize, gridSize as gridSizeFn } from '@atlaskit/theme/constants';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import {
  actionSectionDesktopStyles,
  actionSectionMobileStyles, globalSkeletonStyles,
} from '../../common/styles';
import { AppNavigationTheme } from '../../theme';
import { SecondaryButtonSkeleton } from '../IconButton';

const gridSize = gridSizeFn();

// TODO
const searchCommonStyles = css`
  width: 220px;
  height: ${gridSize * 4}px;
  border-radius: ${gridSize * 2}px;
  box-sizing: border-box;
  padding: 0 ${gridSize}px 0 40px;
`;

export const searchInputContainerStyles = css`
  ${actionSectionDesktopStyles}
  margin-left: 20px;
  padding-right: ${gridSize}px;
  position: relative;
`;

export const searchInputStyles = ({
  mode: { search },
}: AppNavigationTheme) => ({
  width: '220px',
  height: `${gridSize * 4}px`,
  outline: 'none',
  borderRadius: `${gridSize * 2}px`,
  border: 'none',
  boxSizing: 'border-box' as const,
  padding: `0 ${gridSize}px 0 40px`,
  fontSize: `${fontSize()}px`,
  ...search,
  '::placeholder': {
    color: 'inherit',
  },
});

export const searchInputIconStyles = css`
  position: absolute;
  left: 10px;
  top: 5px;
  width: 20px;
  height: 20px;
  pointer-events: none;
`;

export const searchInputSkeletonStyles = css`
  margin-right: 6px;
  ${searchCommonStyles}
  ${globalSkeletonStyles}
`;

export const searchIconStyles = actionSectionMobileStyles;

export const SearchIconSkeleton = styled(SecondaryButtonSkeleton)`
  width: ${gridSize * 3.25}px;
  height: ${gridSize * 3.25}px;
  margin: 0px 5px;
  ${searchIconStyles}
`;
