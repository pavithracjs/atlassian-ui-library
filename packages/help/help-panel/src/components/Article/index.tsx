import * as React from 'react';
import { withHelp, HelpContextInterface } from '../HelpContext';
import ArticleContent from './ArticleContent';
import RelatedArticles from './RelatedArticles';
import RatingButton from './RatingButton';

import { Article } from '../../model/Article';

export interface Props {
  help: HelpContextInterface;
}

const Article = (props: Props) => {
  const { article } = props.help;

  if (article) {
    return (
      <>
        <ArticleContent title={article.title} body={article.body} />
        <RatingButton />
        <RelatedArticles />
      </>
    );
  } else {
    return null;
  }
};

export default withHelp(Article);
