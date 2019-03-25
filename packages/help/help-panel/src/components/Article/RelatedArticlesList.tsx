import * as React from 'react';

import { ArticleItem } from '../../model/Article';

import RelatedArticlesListItem from './RelatedArticlesListItem';

interface Props {
  relatedArticles?: ArticleItem[];
  numberOfArticlesToDisplay: number;
}

const RelatedArticlesList: React.SFC<Props> = props => {
  const { relatedArticles, numberOfArticlesToDisplay } = props;

  if (relatedArticles) {
    return relatedArticles
      .slice(0, numberOfArticlesToDisplay)
      .map(relatedArticle => {
        return (
          <RelatedArticlesListItem
            relatedArticle={relatedArticle}
            key={relatedArticle.id}
          />
        );
      });
  }

  return null;
};

export default RelatedArticlesList;
