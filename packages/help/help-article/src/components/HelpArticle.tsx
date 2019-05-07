import * as React from 'react';
import { ArticleContentInner, ArticleContentTitle } from './styled';
import './styles.css';

export interface Props {
  title?: string;
  body?: string;
}

const ArticleContent: React.SFC<Props> = props => {
  const { title = '', body = '' } = props;
  return (
    <ArticleContentInner>
      {title && (
        <ArticleContentTitle>
          <h2>{title}</h2>
        </ArticleContentTitle>
      )}
      {body && (
        <div
          className={'content-platform-support'}
          dangerouslySetInnerHTML={{ __html: body }}
        />
      )}
    </ArticleContentInner>
  );
};

export default ArticleContent;
