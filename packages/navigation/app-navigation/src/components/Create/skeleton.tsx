/** @jsx jsx */
import { gridSize } from '@atlaskit/theme/constants';
import { jsx } from '@emotion/core';
import { Fragment } from 'react';
import { IconButtonSkeleton } from '../IconButton/skeleton';
import { createButtonSkeletonStyles, createIconSkeletonStyles } from './styles';

export const CreateSkeleton = () => (
  <Fragment>
    <div css={createButtonSkeletonStyles} />
    <IconButtonSkeleton
      css={createIconSkeletonStyles}
      dimension={gridSize() * 3.25}
    />
  </Fragment>
);
