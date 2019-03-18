import * as React from 'react';
import { withAnalytics } from '@atlaskit/analytics';

import { Article, ArticleItem } from '../model/Article';
import { RequestState } from '../model/Resquests';

import Search from './Search';
import ArticleComponent from './Article';

const MIN_CHARACTERS_FOR_SEARCH = 3;

export enum VIEW {
  ARTICLE,
  SEARCH_RESULT,
  SEARCH_RESULT_ARTICLE,
}

export interface Props {
  isOpen: boolean;
  // Article
  articleId: string;
  onGetArticle(id: string): Article;
  // Search
  onSearch?(value: string): ArticleItem[];
}

export interface State {
  view: VIEW;
  // Article
  article?: Article;
  articleState: RequestState;
  // Search
  searchValue: string;
  searchResult: ArticleItem[];
  searchState: RequestState;
  // Search Result Article
  searchResultArticle?: Article;
  searchResultArticleState: RequestState;
}

export class HelpPanelContent extends React.Component<Props, State> {
  state = {
    view: VIEW.ARTICLE,
    // Article
    article: {
      id: '',
      title: '',
      body: '',
      externalLink: '',
      relatedArticles: [],
    },
    articleState: RequestState.done,
    // Search
    searchValue: '',
    searchResult: [],
    searchState: RequestState.done,
    // Search Result Article
    searchResultArticle: {},
    searchResultArticleState: RequestState.done,
  };

  handleOnSearch = async value => {
    const { onSearch } = this.props;
    const searchValue = value;

    await this.setState({ searchValue });

    if (onSearch) {
      if (searchValue.length > MIN_CHARACTERS_FOR_SEARCH) {
        this.setState({ searchState: RequestState.loading });
        try {
          const searchResult = await onSearch(searchValue);
          this.setState({
            searchResult,
            searchState: RequestState.done,
            view: VIEW.SEARCH_RESULT,
          });
        } catch (error) {
          console.log(error);
          this.setState({ searchState: RequestState.error });
        }
      }

      if (searchValue.length === 0) {
        this.setState({
          view: VIEW.ARTICLE,
          searchResult: [],
          searchState: RequestState.done,
        });
      }
    }
  };

  getArticle = async (
    articleId: string,
    onGetArticle: ((id: string) => Article) | undefined,
  ) => {
    if (onGetArticle) {
      this.setState({ articleState: RequestState.loading });
      try {
        const article = await onGetArticle(articleId);
        this.setState({ article, articleState: RequestState.done });
      } catch (error) {
        console.log(error);
        this.setState({ articleState: RequestState.error });
      }
    }
  };

  isSearchVisible = (
    view: VIEW,
    onSearch: ((value: string) => ArticleItem[]) | undefined,
  ) => {
    return onSearch && (view === VIEW.ARTICLE || view === VIEW.SEARCH_RESULT);
  };

  isArticleVisible = (view: VIEW) => {
    return view === VIEW.ARTICLE;
  };

  componentDidMount() {
    const { articleId, onGetArticle } = this.props;
    this.getArticle(articleId, onGetArticle);
  }

  render() {
    return (
      <>
        {this.isSearchVisible(this.state.view, this.props.onSearch) && (
          <Search
            isLoading={this.state.searchState === RequestState.loading}
            onSearchInput={this.handleOnSearch}
            searchResult={this.state.searchResult}
          />
        )}
        {this.isArticleVisible(this.state.view) && (
          <ArticleComponent {...this.state.article} />
        )}
      </>
    );
  }
}

export default withAnalytics(HelpPanelContent, {}, {});
