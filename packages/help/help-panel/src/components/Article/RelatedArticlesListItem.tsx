import * as React from 'react';
import Item from '@atlaskit/item';
import * as colors from '@atlaskit/theme/colors';
import DocumentFilledIcon from '@atlaskit/icon/glyph/document-filled';

import { withHelp, HelpContextInterface } from '../HelpContext';
import { ArticleItem } from '../../model/Article';

interface Props {
  relatedArticle: ArticleItem;
}

const RelatedArticlesListItem = (props: Props & HelpContextInterface) => {
  const { relatedArticle, help } = props;

  const handleOnClick = () => {
    help.navigateTo(relatedArticle.id);
  };

  return (
    <Item
      onClick={handleOnClick}
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
    </Item>
  );
};

export default withHelp(RelatedArticlesListItem);
