/** @jsx jsx */
import { jsx } from '@emotion/core';
import { Fragment } from 'react';

import { SearchInputSkeleton, SearchWrapper, IconWrapper } from './styled';
import { searchIconStyles, searchInputStyles } from './styles';

export const SearchSkeleton = () => {
  return (
    <Fragment>
      <SearchWrapper css={searchInputStyles}>
        <IconWrapper />
        <SearchInputSkeleton />
      </SearchWrapper>
      <div css={searchIconStyles} />
    </Fragment>
  );
};
