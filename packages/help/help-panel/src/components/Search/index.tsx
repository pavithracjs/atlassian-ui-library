import * as React from 'react';
import { QuickSearch } from '@atlaskit/quick-search';
import { ObjectResult } from '@atlaskit/quick-search';
import { colors } from '@atlaskit/theme';
import DocumentFilledIcon from '@atlaskit/icon/glyph/document-filled';

import { SearchList } from './styled';

const Search = props => {
  const { isLoading, searchValue, onSearchInput, searchResult } = props;
  return (
    <QuickSearch
      isLoading={isLoading}
      value={searchValue}
      onSearchInput={onSearchInput}
    >
      {searchResult.length > 0 ? (
        <SearchList>
          {searchResult.map(searchResultItem => {
            return (
              <ObjectResult
                resultId={searchResultItem.id}
                name={searchResultItem.title}
                key={searchResultItem.id}
                containerName={searchResultItem.description}
                avatar={
                  <DocumentFilledIcon
                    primaryColor={colors.P500}
                    size="medium"
                    label={searchResultItem.title}
                  />
                }
              />
            );
          })}
        </SearchList>
      ) : null}
    </QuickSearch>
  );
};

export default Search;
