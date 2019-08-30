import { gridSize as gridSizeFn } from '@atlaskit/theme';
import { css } from '@emotion/core';
import { PRODUCT_HOME_BREAKPOINT } from '../../common/constants';

const gridSize = gridSizeFn();

export const containerStyles = css`
  align-items: center;
  display: flex;

  @media (min-width: ${PRODUCT_HOME_BREAKPOINT}px) {
    margin-right: ${gridSize * 2}px;
  }

  @media (min-width: ${PRODUCT_HOME_BREAKPOINT - 1}px) {
    margin-right: ${gridSize * 3}px;
  }
`;

const imageStyles = css`
  height: 40px;
`;

export const productIconStyles = css`
  @media (min-width: ${PRODUCT_HOME_BREAKPOINT}px) {
    display: none;
  }
`;

export const customProductIconStyles = css`
  ${productIconStyles};
  ${imageStyles}
`;

export const productLogoStyles = css`
  @media (max-width: ${PRODUCT_HOME_BREAKPOINT - 1}px) {
    display: none;
  }
`;

export const customProductLogoStyles = css`
  ${productLogoStyles};
  ${imageStyles}
`;
