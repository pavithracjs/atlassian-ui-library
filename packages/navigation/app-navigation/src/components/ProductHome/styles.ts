import { gridSize as gridSizeFn } from '@atlaskit/theme';
import { css } from '@emotion/core';
import { PRODUCT_HOME_BREAKPOINT } from '../../common/constants';
import { skeletonStyles } from '../../common/styles';
import { AppNavigationTheme } from '../../theme';

const gridSize = gridSizeFn();

export const containerStyles = css`
  align-items: center;
  display: flex;

  @media (max-width: ${PRODUCT_HOME_BREAKPOINT - 1}px) {
    margin-right: ${gridSize}px;
  }

  @media (min-width: ${PRODUCT_HOME_BREAKPOINT}px) {
    margin-right: ${gridSize * 2}px;
  }
`;

export const containerSkeletonStyles = containerStyles;

const imageHeight = 40;

const imageStyles = css`
  height: ${imageHeight}px;
`;

export const productIconStyles = css`
  @media (min-width: ${PRODUCT_HOME_BREAKPOINT}px) {
    display: none;
  }
`;

const iconHeight = 28;

export const productIconSkeletonStyles = (theme: AppNavigationTheme) => [
  css`
    width: ${iconHeight}px;
    height: ${iconHeight}px;
    border-radius: 50%;
    ${productIconStyles}
  `,
  skeletonStyles(theme),
];

export const customProductIconStyles = css`
  ${productIconStyles};
  ${imageStyles}
`;

export const productLogoStyles = css`
  @media (max-width: ${PRODUCT_HOME_BREAKPOINT - 1}px) {
    display: none;
  }
`;

export const productLogoSkeletonStyles = (theme: AppNavigationTheme) => [
  css`
    width: 120px;
    border-radius: ${imageHeight / 2}px;
    ${productLogoStyles}
    ${imageStyles}
  `,
  skeletonStyles(theme),
];

export const customProductLogoStyles = css`
  ${productLogoStyles};
  ${imageStyles}
`;
