import * as React from 'react';
import { withHelp, HelpContextInterface } from '../HelpContext';
import { injectIntl, InjectedIntlProps } from 'react-intl';

import { ArticleContentInner, ArticleVoteInner } from './styled';
import { messages } from '../../messages';

interface Props {
  help: HelpContextInterface;
}

const RatingButton = (props: Props & InjectedIntlProps) => {
  if (props.help.onWasHelpfulSubmit) {
    return (
      <ArticleContentInner>
        <ArticleVoteInner>
          {props.intl.formatMessage(messages.help_panel_article_rating_title)}
        </ArticleVoteInner>
      </ArticleContentInner>
    );
  }

  return null;
};

export default withHelp(injectIntl(RatingButton));
