import * as React from 'react';
import ArticleContent from './ArticleContent';
import RelatedArticles from './RelatedArticles';
import RatingButton from './RatingButton';

import { Article } from '../../model/Article';

export interface Props {
  article: Article;
}

const Article = (props: Props) => {
  const { article } = props;

  if (article) {
    return (
      <>
        <ArticleContent title={article.title} body={article.body} />
        <RatingButton />
        <RelatedArticles relatedArticles={article.relatedArticles} />
      </>
    );
  } else {
    return null;
  }
};

export default Article;
