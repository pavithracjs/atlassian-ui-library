import * as React from 'react';

import RelatedArticles from './RelatedArticles';
import RatingButton from './RatingButton';
import { ArticleContentInner } from './styled';

const ArticleContent = ({ title = '', body = '' }) => (
  <ArticleContentInner>
    {title && title !== undefined ? <h2>{title}</h2> : null}
    {body && body !== undefined ? <p>{body}</p> : null}
  </ArticleContentInner>
);

const Article = ({ id, title, body, externalLink, relatedArticles }) => (
  <>
    <ArticleContent title={title} body={body} />
    <RatingButton />
    {relatedArticles ? (
      <RelatedArticles relatedArticles={relatedArticles} />
    ) : null}
  </>
);

export default Article;
