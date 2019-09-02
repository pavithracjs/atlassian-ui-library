/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Fragment } from 'react';

import {
  SearchInputSkeleton,
  SearchWrapper,
  IconWrapper,
  SearchIconSkeleton,
} from './styled';
import { searchInputStyles } from './styles';

export const SearchSkeleton = () => {
  return (
    <Fragment>
      <SearchWrapper css={searchInputStyles}>
        <IconWrapper />
        <SearchInputSkeleton />
      </SearchWrapper>
      <SearchIconSkeleton />
    </Fragment>
  );
};
