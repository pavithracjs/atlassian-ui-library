import * as React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { messages } from '../../messages';

export interface Props {
  showMoreToggeled: boolean;
  toggleRelatedArticles: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

export const ShowMoreArticlesButton: React.SFC<
  Props & InjectedIntlProps
> = props => {
  const {
    intl: { formatMessage },
    showMoreToggeled,
    toggleRelatedArticles,
  } = props;
  if (showMoreToggeled) {
    return (
      <a onClick={toggleRelatedArticles} style={{ cursor: 'pointer' }}>
        {formatMessage(messages.help_panel_related_article_show_more)}
      </a>
    );
  } else {
    return (
      <a onClick={toggleRelatedArticles} style={{ cursor: 'pointer' }}>
        {formatMessage(messages.help_panel_related_article_show_less)}
      </a>
    );
  }
};

export default injectIntl(ShowMoreArticlesButton);
