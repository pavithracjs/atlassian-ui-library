import * as React from 'react';
import ArticleContent from './ArticleContent';
import RelatedArticles from './RelatedArticles';
import RatingButton from './RatingButton';

import { Article as ArticleModel } from '../../model/Article';

export interface Props {
  article: ArticleModel;
  children?: any;
}

const Article: React.SFC<Props> = props => {
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
