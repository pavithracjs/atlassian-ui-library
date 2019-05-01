import * as React from 'react';
import { ObjectResult } from '@atlaskit/quick-search';
import { colors } from '@atlaskit/theme/colors';
import DocumentFilledIcon from '@atlaskit/icon/glyph/document-filled';

import { ArticleItem } from '../../model/Article';
import { SearchResultsList } from './styled';

export interface Props {
  searchResult?: ArticleItem[];
}

export const SearchResults = (props: Props) => {
  const { searchResult = [] } = props;

  return (
    <SearchResultsList>
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
    </SearchResultsList>
  );
};

export default SearchResults;
