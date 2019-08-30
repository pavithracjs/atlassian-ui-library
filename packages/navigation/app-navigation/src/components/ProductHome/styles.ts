import { gridSize as gridSizeFn } from '@atlaskit/theme';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { PRODUCT_HOME_BREAKPOINT } from '../../common/constants';
import { globalSkeletonStyles } from '../../common/styles';

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

const imageHeight = 40;

const imageStyles = css`
  height: ${imageHeight}px;
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

export const LogoSkeleton = styled.div`
  width: 120px;
  border-radius: ${imageHeight / 2}px;
  ${imageStyles}
  ${globalSkeletonStyles}
`;

const iconHeight = 28;

export const IconSkeleton = styled.div`
  width: ${iconHeight}px;
  height: ${iconHeight}px;
  border-radius: 50%;
  ${globalSkeletonStyles}
`;

export const containerSkeletonStyles = css`
  ${containerStyles};
`;
