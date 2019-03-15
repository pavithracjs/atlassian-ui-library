import * as React from 'react';
import { ThemeProvider } from 'styled-components';
import Item, { itemThemeNamespace } from '@atlaskit/item';
import { colors, gridSize } from '@atlaskit/theme';
import DocumentFilledIcon from '@atlaskit/icon/glyph/document-filled';

import { ArticleItem } from '../../model/Article';
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

interface RelatedArticlesProps {
  relatedArticles: ArticleItem[];
}

interface RelatedArticlesState {
  showMoreToggeled: boolean;
}

export class RelatedArticles extends React.Component<
  RelatedArticlesProps,
  RelatedArticlesState
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
    const { relatedArticles } = this.props;
    if (relatedArticles.length > 0) {
      return (
        <ArticleContentInner>
          <ThemeProvider theme={{ [itemThemeNamespace]: itemTheme }}>
            <>
              <ItemGroupTitle>RELATED</ItemGroupTitle>

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
    } else {
      return null;
    }
  }
}

interface RelatedArticlesListProps {
  relatedArticles?: ArticleItem[];
  numberOfArticlesToDisplay: number;
}

const RelatedArticlesList: React.SFC<RelatedArticlesListProps> = props => {
  const { relatedArticles, numberOfArticlesToDisplay } = props;
  let articlesList: any = [];
  if (relatedArticles) {
    for (let i = 0; i < numberOfArticlesToDisplay; i++) {
      const relatedArticle = relatedArticles[i];
      articlesList.push(
        <Item
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
        </Item>,
      );
    }
  }
  return articlesList;
};

interface ShowMoreArticlesButtonProps {
  showMoreToggeled: boolean;
  toggleRelatedArticles: (event: React.MouseEvent<HTMLAnchorElement>) => void;
}

const ShowMoreArticlesButton: React.SFC<
  ShowMoreArticlesButtonProps
> = props => {
  const { showMoreToggeled, toggleRelatedArticles } = props;
  if (showMoreToggeled) {
    return <a onClick={toggleRelatedArticles}>Show more related</a>;
  } else {
    return <a onClick={toggleRelatedArticles}>Show less related</a>;
  }
};

export default RelatedArticles;
