import * as React from 'react';
import {
  ArticleContentInner,
  ArticleContentTitle,
  ArticleContentTitleLink,
} from './styled';
import ShortcutIcon from '@atlaskit/icon/glyph/shortcut';
export interface Props {
  // Article Title
  title?: string;
  // Article Content
  body?: string;
  // URL used as href value of the Article Title. If is undefined, the title will a regular H2 tag instead of a link
  titleLinkUrl?: string;
}

const HelpArticle: React.SFC<Props> = props => {
  const { title = '', body = '', titleLinkUrl } = props;
  return (
    <ArticleContentInner>
      {title && (
        <ArticleContentTitle>
          {titleLinkUrl ? (
            <ArticleContentTitleLink href={titleLinkUrl} target="_blank">
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
