import * as React from 'react';
import { withAnalytics } from '@atlaskit/analytics';
import ArrowleftIcon from '@atlaskit/icon/glyph/arrow-left';
import { injectIntl, InjectedIntlProps } from 'react-intl';

import { withHelp, HelpContextInterface } from './HelpContext';
import { messages } from '../messages';

import Search from './Search';
import ArticleComponent from './Article';
import { BackButton } from './styled';

export interface Props {}

export const HelpPanelContent = (
  props: Props & InjectedIntlProps & HelpContextInterface,
) => {
  const {
    help,
    intl: { formatMessage },
  } = props;

  if (
    help.defaultArticle !== undefined &&
    help.defaultArticle !== null &&
    help.history.length === 0
  ) {
    return (
      <>
        {help.isSearchVisible() && <Search />}
        {help.isArticleVisible() && (
          <ArticleComponent article={help.defaultArticle} />
        )}
      </>
    );
  }

  if (help.history.length > 0) {
    return (
      <>
        <BackButton onClick={help.navigateBack}>
          <ArrowleftIcon label="back" size="medium" />
          {formatMessage(messages.help_panel_navigation_back)}
        </BackButton>
        <ArticleComponent article={help.history[help.history.length - 1]} />
      </>
    );
  }

  return <>{help.defaultContent}</>;
};

export default withAnalytics(withHelp(injectIntl(HelpPanelContent)), {}, {});
