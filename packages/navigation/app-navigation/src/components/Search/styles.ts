import { fontSize, gridSize as gridSizeFn } from '@atlaskit/theme/constants';
import { css } from '@emotion/core';
import {
  actionSectionDesktopStyles,
  actionSectionMobileStyles,
  skeletonStyles,
} from '../../common/styles';
import { AppNavigationTheme } from '../../theme';

const gridSize = gridSizeFn();

const searchCommonStyles = css`
  width: 220px;
  height: ${gridSize * 4}px;
  border-radius: ${gridSize * 2}px;
  box-sizing: border-box;
  padding: 0 ${gridSize}px 0 40px;
`;

export const searchIconStyles = actionSectionMobileStyles;
export const searchIconSkeletonStyles = searchIconStyles;

export const searchInputContainerStyles = css`
  ${actionSectionDesktopStyles}
  margin-left: 20px;
  padding-right: ${gridSize}px;
  position: relative;
`;

export const searchInputStyles = ({ mode: { search } }: AppNavigationTheme) => [
  css`
    ${searchCommonStyles};
    outline: none;
    border: none;
    font-size: ${fontSize()}px;
    ::placeholder {
      color: inherit;
    }
  `,
  search,
];

export const searchInputIconStyles = css`
  position: absolute;
  left: 10px;
  top: 5px;
  width: 20px;
  height: 20px;
  pointer-events: none;
`;

export const searchInputSkeletonStyles = (theme: AppNavigationTheme) => [
  searchCommonStyles,
  skeletonStyles(theme),
];
