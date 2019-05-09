import * as React from 'react';
import {
  ArticleContentInner,
  ArticleContentTitle,
  ArticleContentTitleLink,
} from './styled';
import StyleTag from './styles/StyleTag';
import ShortcutIcon from '@atlaskit/icon/glyph/shortcut';
export interface Props {
  title?: string;
  body?: string;
  titleLinkUrl?: string;
}

const HelpArticle: React.SFC<Props> = props => {
  const { title = '', body = '', titleLinkUrl } = props;
  return (
    <ArticleContentInner>
      <StyleTag />
      {title && (
        <ArticleContentTitle>
          {titleLinkUrl ? (
            <ArticleContentTitleLink href={titleLinkUrl}>
              <h2>
                {title}
                <span> </span>
                <ShortcutIcon label="link icon" size="small" />
              </h2>
            </ArticleContentTitleLink>
          ) : (
            <h2>{title}</h2>
          )}
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

export default HelpArticle;
