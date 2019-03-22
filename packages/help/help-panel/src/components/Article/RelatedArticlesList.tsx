import * as React from 'react';
import Item from '@atlaskit/item';
import { colors } from '@atlaskit/theme';
import DocumentFilledIcon from '@atlaskit/icon/glyph/document-filled';

import { ArticleItem } from '../../model/Article';

interface Props {
  relatedArticles?: ArticleItem[];
  numberOfArticlesToDisplay: number;
}

const RelatedArticlesList: React.SFC<Props> = props => {
  const { relatedArticles, numberOfArticlesToDisplay } = props;
  let articlesList: any = [];
  if (relatedArticles) {
    for (let i = 0; i < numberOfArticlesToDisplay; i++) {
      const relatedArticle = relatedArticles[i];
      articlesList.push(
        <Item
          description={relatedArticle.description}
          key={relatedArticle.id}
          elemBefore={
            <DocumentFilledIcon
              primaryColor={colors.P500}
              size="medium"
              label={relatedArticle.title}
            />
          }
        >
          {relatedArticle.title}
        </Item>,
      );
    }
  }
  return articlesList;
};

export default RelatedArticlesList;
