import * as React from 'react';
import { ThemeProvider } from 'styled-components';
import { itemThemeNamespace } from '@atlaskit/item';
import { gridSize } from '@atlaskit/theme';
import { injectIntl, InjectedIntlProps } from 'react-intl';

import { ArticleItem } from '../../model/Article';
import { messages } from '../../messages';
import RelatedArticlesList from './RelatedArticlesList';
import ShowMoreArticlesButton from './ShowMoreArticlesButton';
import { ItemGroupTitle } from '../styled';
import { ArticleContentInner } from './styled';

const itemTheme = {
  padding: {
    default: {
      bottom: gridSize(),
      left: gridSize(),
      top: gridSize(),
      right: gridSize(),
    },
  },
};

interface Props {
  relatedArticles?: ArticleItem[];
}

interface State {
  showMoreToggeled: boolean;
}

export class RelatedArticles extends React.Component<
  Props & InjectedIntlProps,
  State
> {
  state = {
    showMoreToggeled: true,
  };

  getNumberOfArticlesToDisplay = showMoreToggeled => {
    return showMoreToggeled ? 3 : 5;
  };

  toggleRelatedArticles = () => {
    this.setState({ showMoreToggeled: !this.state.showMoreToggeled });
  };

  render() {
    const {
      intl: { formatMessage },
      relatedArticles,
    } = this.props;

    // if there are related articles
    if (
      relatedArticles &&
      relatedArticles != null &&
      relatedArticles.length > 0
    ) {
      // Display list of related articles
      return (
        <ArticleContentInner>
          <ThemeProvider theme={{ [itemThemeNamespace]: itemTheme }}>
            <>
              <ItemGroupTitle>
                {formatMessage(messages.help_panel_related_article_title)}
              </ItemGroupTitle>

              <RelatedArticlesList
                relatedArticles={relatedArticles}
                numberOfArticlesToDisplay={this.getNumberOfArticlesToDisplay(
                  this.state.showMoreToggeled,
                )}
              />
              {relatedArticles.length > 3 ? (
                <ShowMoreArticlesButton
                  toggleRelatedArticles={this.toggleRelatedArticles}
                  showMoreToggeled={this.state.showMoreToggeled}
                />
              ) : null}
            </>
          </ThemeProvider>
        </ArticleContentInner>
      );
    }

    return null;
  }
}

export default injectIntl(RelatedArticles);
