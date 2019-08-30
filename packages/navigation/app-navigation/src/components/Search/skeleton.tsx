/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Fragment } from 'react';

import {
  searchInputContainerStyles,
  searchInputIconStyles,
  searchInputSkeletonStyles,
  SearchIconSkeleton,
} from './styles';

export const SearchSkeleton = () => {
  return (
    <Fragment>
      <div css={searchInputContainerStyles}>
        <div css={searchInputIconStyles} />
        <div css={searchInputSkeletonStyles} />
      </div>
      <SearchIconSkeleton />
    </Fragment>
  );
};
