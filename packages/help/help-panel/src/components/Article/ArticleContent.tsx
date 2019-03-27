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
      {title && title !== undefined && <h2>{title}</h2>}
      {body && body !== undefined && (
        <div dangerouslySetInnerHTML={{ __html: body }} />
      )}
    </ArticleContentInner>
  );
};

export default ArticleContent;
