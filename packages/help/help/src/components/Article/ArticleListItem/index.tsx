import * as React from 'react';

import { withHelp, HelpContextInterface } from '../../HelpContext';
import { ArticleItem } from '../../../model/Article';
import {
  ArticlesListItemTitleIcon,
  ArticlesListItemWrapper,
  ArticlesListItemTitle,
  ArticlesListItemTitleText,
  ArticlesListItemDescription,
} from './styled';

interface Props {
  onClick: (id: string) => void;
  title: string;
  description: string;
  relatedArticle: ArticleItem;
  icon: Element;
  id: string;
}

const ArticlesListItem = (props: Props) => {
  const { id, title, description, icon, onClick } = props;

  const handleOnClick = (event: React.MouseEvent) => {
    event.preventDefault();
    onClick(id);
  };

  return (
    <ArticlesListItemWrapper
      aria-disabled="false"
      role="button"
      href=""
      onClick={handleOnClick}
    >
      <ArticlesListItemTitle>
        <ArticlesListItemTitleIcon>{icon}</ArticlesListItemTitleIcon>
        <ArticlesListItemTitleText>{title}</ArticlesListItemTitleText>
      </ArticlesListItemTitle>
      <ArticlesListItemDescription>{description}</ArticlesListItemDescription>
    </ArticlesListItemWrapper>
  );
};

export default withHelp(ArticlesListItem);
