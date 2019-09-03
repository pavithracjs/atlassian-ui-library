/** @jsx jsx */
import { jsx } from '@emotion/core';
import {
  containerSkeletonStyles,
  productIconStyles,
  productLogoStyles,
  LogoSkeleton,
  IconSkeleton,
} from './styles';

export const ProductHomeSkeleton = () => (
  <div css={containerSkeletonStyles}>
    <div css={productLogoStyles}>
      <LogoSkeleton />
    </div>
    <div css={productIconStyles}>
      <IconSkeleton />
    </div>
  </div>
);
