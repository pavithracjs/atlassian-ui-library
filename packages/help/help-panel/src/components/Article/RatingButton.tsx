import * as React from 'react';
import { withHelp, HelpContextInterface } from '../HelpContext';
import { injectIntl, InjectedIntlProps } from 'react-intl';

import { ArticleContentInner, ArticleVoteInner } from './styled';
import { messages } from '../../messages';

interface Props {}

const RatingButton: React.SFC<
  Props & InjectedIntlProps & HelpContextInterface
> = props => {
  const { help } = props;
  if (help.onWasHelpfulSubmit) {
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

export default injectIntl(withHelp(RatingButton));
