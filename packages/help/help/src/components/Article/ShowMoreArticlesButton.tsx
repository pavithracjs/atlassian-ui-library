import * as React from 'react';
import { injectIntl, InjectedIntlProps } from 'react-intl';
import { messages } from '../../messages';
import { ToggleShowMoreArticles } from './styled';

export interface Props {
  showMoreToggeled: boolean;
  toggleRelatedArticles: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

export class ShowMoreArticlesButton extends React.Component<
  Props & InjectedIntlProps
> {
  render() {
    const {
      intl: { formatMessage },
      showMoreToggeled,
      toggleRelatedArticles,
    } = this.props;
    if (showMoreToggeled) {
      return (
        <ToggleShowMoreArticles onClick={toggleRelatedArticles}>
          {formatMessage(messages.help_panel_related_article_show_more)}
        </ToggleShowMoreArticles>
      );
    } else {
      return (
        <ToggleShowMoreArticles>
          {formatMessage(messages.help_panel_related_article_show_less)}
        </ToggleShowMoreArticles>
      );
    }
  }
}

export default injectIntl(ShowMoreArticlesButton);
