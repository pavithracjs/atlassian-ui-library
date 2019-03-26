import * as React from 'react';
import { ArticleContentInner } from './styled';

export interface Props {
  title?: string;
  body?: string;
}

const ArticleContent: React.SFC<Props> = props => {
  const { title = '', body = '' } = props;
  return (
    <ArticleContentInner>
      {title && title !== undefined ? <h2>{title}</h2> : null}
      {body && body !== undefined ? <p>{body}</p> : null}
    </ArticleContentInner>
  );
};

export default ArticleContent;
