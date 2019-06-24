import * as React from 'react';

import {
  LoadingRectangle,
  LoadignRelatedArticleList,
  LoadignRelatedArticleListItem,
  LoadignRelatedArticleListItemText,
  LoadignRelatedArticleSection,
} from './styled';

const Loading = () => {
  return (
    <>
      <div>
        <LoadingRectangle contentHeight="20px" marginTop="0" />
        <LoadingRectangle contentWidth="90%" />
        <LoadingRectangle contentWidth="80%" />
        <LoadingRectangle contentWidth="80%" />
        <LoadingRectangle contentWidth="70%" />
      </div>

      <LoadignRelatedArticleSection>
        <LoadingRectangle
          contentHeight="8px"
          contentWidth="40px"
          marginTop="0"
        />
        <LoadignRelatedArticleList>
          <LoadignRelatedArticleListItem>
            <LoadingRectangle
              contentWidth="40px"
              contentHeight="40px"
              marginTop="0"
            />
            <LoadignRelatedArticleListItemText>
              <LoadingRectangle marginTop="0" contentWidth="100%" />
              <LoadingRectangle contentWidth="100%" />
            </LoadignRelatedArticleListItemText>
          </LoadignRelatedArticleListItem>

          <LoadignRelatedArticleListItem>
            <LoadingRectangle
              contentWidth="40px"
              contentHeight="40px"
              marginTop="0"
            />
            <LoadignRelatedArticleListItemText>
              <LoadingRectangle marginTop="0" contentWidth="100%" />
              <LoadingRectangle contentWidth="100%" />
            </LoadignRelatedArticleListItemText>
          </LoadignRelatedArticleListItem>

          <LoadignRelatedArticleListItem>
            <LoadingRectangle
              contentWidth="40px"
              contentHeight="40px"
              marginTop="0"
            />
            <LoadignRelatedArticleListItemText>
              <LoadingRectangle marginTop="0" contentWidth="100%" />
              <LoadingRectangle contentWidth="100%" />
            </LoadignRelatedArticleListItemText>
          </LoadignRelatedArticleListItem>
        </LoadignRelatedArticleList>
      </LoadignRelatedArticleSection>
    </>
  );
};

export default Loading;
