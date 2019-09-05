/** @jsx jsx */
import { gridSize } from '@atlaskit/theme/constants';
import { jsx } from '@emotion/core';
import { Fragment } from 'react';

import { IconButtonSkeleton } from '../IconButton/skeleton';
import {
  searchIconSkeletonStyles,
  searchInputContainerStyles,
  searchInputSkeletonStyles,
} from './styles';

export const SearchSkeleton = () => {
  return (
    <Fragment>
      <div css={searchInputContainerStyles}>
        <div css={searchInputSkeletonStyles} />
      </div>
      <IconButtonSkeleton
        css={searchIconSkeletonStyles}
        dimension={gridSize() * 3.25}
        marginRight={5}
      />
    </Fragment>
  );
};
