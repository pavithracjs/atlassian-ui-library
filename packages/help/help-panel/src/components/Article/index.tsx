import * as React from 'react';
import RelatedArticles from './RelatedArticles';
import { ArticleContentInner, ArticleVoteInner } from './styled';

const ArticleContent = ({ title = '', body = '' }) => (
  <ArticleContentInner>
    {title && title !== undefined ? <h2>{title}</h2> : null}
    {body && body !== undefined ? <p>{body}</p> : null}
  </ArticleContentInner>
);

const ArticleVote = () => (
  <ArticleContentInner>
    <ArticleVoteInner>Was this helpful?</ArticleVoteInner>
  </ArticleContentInner>
);

const Article = ({ id, title, body, externalLink, relatedArticles }) => (
  <>
    <ArticleContent title={title} body={body} />
    <ArticleVote />
    {relatedArticles ? (
      <RelatedArticles relatedArticles={relatedArticles} />
    ) : null}
  </>
);

export default Article;
