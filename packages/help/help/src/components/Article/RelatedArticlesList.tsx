import * as React from 'react';
import * as colors from '@atlaskit/theme/colors';
import DocumentFilledIcon from '@atlaskit/icon/glyph/document-filled';

import { withHelp, HelpContextInterface } from '../HelpContext';
import { ArticleItem } from '../../model/Article';

import RelatedArticlesListItem from './ArticleListItem';

interface Props {
  relatedArticles?: ArticleItem[];
  numberOfArticlesToDisplay: number;
}

const RelatedArticlesList: React.SFC<Props & HelpContextInterface> = (
  props: Props & HelpContextInterface,
) => {
  const { relatedArticles, numberOfArticlesToDisplay, help } = props;

  const handleOnClick = (id: string) => {
    help.loadArticle(id);
  };

  if (relatedArticles) {
    const relatedArticlesElm = relatedArticles
      .slice(0, numberOfArticlesToDisplay)
      .map(relatedArticle => {
        return (
          <RelatedArticlesListItem
            id={relatedArticle.id}
            onClick={handleOnClick}
            title={relatedArticle.title}
            description={relatedArticle.description}
            key={relatedArticle.id}
            icon={
              <DocumentFilledIcon
                primaryColor={colors.P300}
                size="medium"
                label={relatedArticle.title}
              />
            }
          />
        );
      });

    return <>{relatedArticlesElm}</>;
  }

  return null;
};

export default withHelp(RelatedArticlesList);
