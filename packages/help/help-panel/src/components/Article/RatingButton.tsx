import * as React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';

import { ArticleContentInner, ArticleVoteInner } from './styled';
import { messages } from '../../messages';

const RatingButton = (props: InjectedIntlProps) => (
  <ArticleContentInner>
    <ArticleVoteInner>
      {props.intl.formatMessage(messages.help_panel_article_rating_title)}
    </ArticleVoteInner>
  </ArticleContentInner>
);

export default injectIntl(RatingButton);
