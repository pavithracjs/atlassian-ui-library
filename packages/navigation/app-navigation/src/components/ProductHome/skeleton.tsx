/** @jsx jsx */
import { jsx } from '@emotion/core';
import {
  containerSkeletonStyles,
  productIconSkeletonStyles,
  productLogoSkeletonStyles,
} from './styles';

export const ProductHomeSkeleton = () => (
  <div css={containerSkeletonStyles}>
    <div css={productLogoSkeletonStyles} />
    <div css={productIconSkeletonStyles} />
  </div>
);
