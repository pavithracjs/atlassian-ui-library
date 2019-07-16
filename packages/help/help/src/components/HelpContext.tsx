import React, { createContext } from 'react';
import { createAndFire, withAnalyticsEvents } from '../analytics';
import {
  CreateUIAnalyticsEventSignature,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';

import { Article, ArticleItem, ArticleFeedback } from '../model/Article';
import { REQUEST_STATE } from '../model/Requests';

import { MIN_CHARACTERS_FOR_SEARCH, VIEW, LOADING_TIMEOUT } from './constants';

export interface Props {
  // Id of the article to display. This prop is optional, if is not defined the default content will be displayed
  articleId?: string;
  // Function used to get an article content. This prop is optional, if is not defined the default content will be displayed
  onGetArticle?(id: string): Promise<Article>;
  // Function used to search an article.  This prop is optional, if is not defined search input will be hidden
  onSearch?(value: string): Promise<ArticleItem[]>;
  // Event handler for the close button. This prop is optional, if this function is not defined the close button will not be displayed
  onButtonCloseClick?(
    event?: React.MouseEvent<HTMLElement, MouseEvent>,
    analyticsEvent?: UIAnalyticsEvent,
  ): void;
  // Function used when the user submits the "Was this helpful" form. This prop is optional, if is not defined the "Was this helpful" section will be hidden
  onWasHelpfulSubmit?(
    value: ArticleFeedback,
    analyticsEvent?: UIAnalyticsEvent,
  ): Promise<boolean>;
  // Event handler for the "Yes" button of the "Was this helpful" section. This prop is optional
  onWasHelpfulYesButtonClick?(
    event?: React.MouseEvent<HTMLElement, MouseEvent>,
    analyticsEvent?: UIAnalyticsEvent,
  ): void;
  // Event handler for the "No" button of the "Was this helpful" section. This prop is optional
  onWasHelpfulNoButtonClick?(
    event?: React.MouseEvent<HTMLElement, MouseEvent>,
    analyticsEvent?: UIAnalyticsEvent,
  ): void;
  // Default content. This prop is optional
  defaultContent?: React.ReactNode;
}

export interface State {
  view: VIEW;
  defaultContent?: React.ReactNode;
  // Article
  articleId: string;
  mainArticle?: Article; // Article to display, if is empty the default content should be displayed
  articleState: REQUEST_STATE;
  history: Article[]; // holds all the articles ID the user has navigated
  hasNavigatedToDefaultContent: boolean;
  // Search
  searchValue: string;
  searchResult: ArticleItem[];
  searchState: REQUEST_STATE;
}

export interface HelpContextInterface {
  help: {
    view: VIEW;
    isSearchVisible(): boolean;
    loadArticle(): void;
    isArticleVisible(): boolean;
    getCurrentArticle(): Article | null;
    onButtonCloseClick?(
      event: React.MouseEvent<HTMLElement, MouseEvent>,
      analyticsEvent: UIAnalyticsEvent,
    ): void;
    onWasHelpfulYesButtonClick?(
      event?: React.MouseEvent<HTMLElement, MouseEvent>,
      analyticsEvent?: UIAnalyticsEvent,
    ): void;
    onWasHelpfulNoButtonClick?(
      event?: React.MouseEvent<HTMLElement, MouseEvent>,
      analyticsEvent?: UIAnalyticsEvent,
    ): void;
    mainArticle?: Article | null; // Article to display, if is empty the default content should be displayed
    articleState: REQUEST_STATE;
    history: Article[]; // holds all the articles ID the user has navigated
    defaultContent?: React.ReactNode;
    navigateBack(): void;
    navigateTo(id: string): void;
    onWasHelpfulSubmit?(
      value: ArticleFeedback,
      analyticsEvent?: UIAnalyticsEvent,
    ): Promise<boolean>;
    onSearch(value: string): void;
    searchResult: ArticleItem[];
    searchState: REQUEST_STATE;
    searchValue: string;
    articleId?: string;
  };
}

const defaultValues = {
  view: VIEW.DEFAULT_CONTENT,
  defaultContent: undefined,
  // Article
  articleId: '',
  mainArticle: undefined, // Article to display, if is empty the default content should be displayed
  articleState: REQUEST_STATE.loading,
  history: [], // holds all the articles ID the user has navigated
  hasNavigatedToDefaultContent: false,
  // Search values
  searchValue: '',
  searchResult: [],
  searchState: REQUEST_STATE.done,
};

const initialiseHelpData = (data: State) => {
  return Object.assign(defaultValues, data);
};

const HelpContext = createContext<Partial<HelpContextInterface>>({});

class HelpContextProviderImplementation extends React.Component<
  Props & { createAnalyticsEvent?: CreateUIAnalyticsEventSignature },
  State
> {
  requestLoadingTimeout: any;

  constructor(props: Props) {
    super(props);

    this.state = initialiseHelpData({
      ...defaultValues,
      articleId: this.props.articleId ? this.props.articleId : '',
    });
  }

  componentDidMount() {
    this.loadArticle();
  }

  componentWillUnmount() {
    clearTimeout(this.requestLoadingTimeout);
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    // sync state.articleId with prop.articleId
    if (this.props.articleId !== prevProps.articleId) {
      this.setState({
        articleId: this.props.articleId ? this.props.articleId : '',
      });
    }

    if (
      this.state.view === prevState.view &&
      this.state.view === VIEW.DEFAULT_CONTENT &&
      this.props.articleId === prevProps.articleId &&
      this.state.hasNavigatedToDefaultContent
    ) {
      this.setState({
        view: VIEW.ARTICLE,
        hasNavigatedToDefaultContent: false,
      });
    }

    // When the articleId changes, get the content of that article
    if (this.state.articleId !== prevState.articleId) {
      this.loadArticle();
    }
  }

  onSearch = async (value: string) => {
    const { onSearch } = this.props;
    const searchValue = value;

    await this.setState({ searchValue });

    // Execute this function only if the this.props.onSearch is defined
    if (onSearch) {
      // If the amount of caracters is > than the minimun defined to fire a search...
      if (searchValue.length > MIN_CHARACTERS_FOR_SEARCH) {
        try {
          this.setState({ searchState: REQUEST_STATE.loading });
          const searchResult = await onSearch(searchValue);
          this.setState({
            searchResult,
            searchState: REQUEST_STATE.done,
          });
        } catch (error) {
          this.setState({ searchState: REQUEST_STATE.error });
        }
      }

      // If the search input is empty, the search results should be empty and
      // the state.view should change to VIEW.ARTICLE
      if (searchValue.length === 0) {
        this.setState({
          view: VIEW.ARTICLE,
          searchResult: [],
          searchState: REQUEST_STATE.done,
        });
      }
    }
  };

  loadArticle = async () => {
    const { articleId } = this.state;

    // If articleId isn't empty, try lo load the article with ID = articleId
    // otherwise display the default content
    if (articleId) {
      this.setState({ view: VIEW.ARTICLE });
      const article = await this.getArticle(articleId);
      this.setState({
        mainArticle: article,
      });
    } else {
      this.setState({
        view: VIEW.DEFAULT_CONTENT,
        // mainArticle: undefined,
        articleState: REQUEST_STATE.done,
      });
    }
  };

  getArticle = async (articleId: string) => {
    // Execute this function only if onGetArticle was defined
    if (this.props.onGetArticle) {
      const { view } = this.state;

      try {
        // if the view === ARTICLE display loading state after ${LOADING_TIMEOUT}ms
        // passed after the request. Otherwise, display the loading state immediately
        if (view === VIEW.ARTICLE) {
          this.requestLoadingTimeout = setTimeout(() => {
            this.setState({ articleState: REQUEST_STATE.loading });
          }, LOADING_TIMEOUT);
        } else {
          this.setState({ articleState: REQUEST_STATE.loading });
        }

        const article = await this.props.onGetArticle(articleId);

        // if we get an article, return it, otherwise display error (by throwing an exeption)
        if (article) {
          this.setState({ articleState: REQUEST_STATE.done });
          clearTimeout(this.requestLoadingTimeout);
          return article;
        }
        throw new Error('EmptyArticle');
      } catch (error) {
        this.setState({ articleState: REQUEST_STATE.error });
        clearTimeout(this.requestLoadingTimeout);
      }
    }

    return undefined;
  };

  navigateBack = async () => {
    // If the history isn't empty, navigate back through the history
    if (this.state.history.length > 0 && this.state.history !== undefined) {
      this.setState(prevState => {
        const newState = { history: [...prevState.history.slice(0, -1)] };
        const historyLastItem = newState.history[newState.history.length - 1];
        if (historyLastItem) {
          const id = historyLastItem.id;

          createAndFire({
            action: 'help-article-changed',
            attributes: { id },
          })(this.props.createAnalyticsEvent!);
        }
      });

      // Otherwise, if the mainArticle isn't empty or we are displaying
      // the error message, navigate back to the "default content"
    } else if (
      this.state.mainArticle ||
      this.state.articleState === REQUEST_STATE.error
    ) {
      this.setState({
        view: VIEW.DEFAULT_CONTENT,
        hasNavigatedToDefaultContent: true,
      });
    }
  };

  navigateTo = async (id: string) => {
    const article = await this.getArticle(id);
    if (article) {
      this.setState(prevState => ({
        history: [...prevState.history, article],
      }));

      createAndFire({
        action: 'help-article-changed',
        attributes: { id },
      })(this.props.createAnalyticsEvent!);
    }
  };

  isSearchVisible = (): boolean => {
    if (this.props.onSearch) {
      return (
        this.state.view === VIEW.ARTICLE ||
        this.state.view === VIEW.DEFAULT_CONTENT
      );
    }

    return false;
  };

  isArticleVisible = (): boolean => {
    return (
      this.state.view === VIEW.ARTICLE &&
      this.state.searchValue.length <= MIN_CHARACTERS_FOR_SEARCH
    );
  };

  getCurrentArticle = () => {
    if (this.state.history.length > 0) {
      return this.state.history[this.state.history.length - 1];
    } else if (this.state.mainArticle !== undefined) {
      return this.state.mainArticle;
    } else {
      return null;
    }
  };

  render() {
    const { hasNavigatedToDefaultContent, ...restState } = this.state;
    return (
      <HelpContext.Provider
        value={{
          help: {
            ...restState,
            loadArticle: this.loadArticle,
            isSearchVisible: this.isSearchVisible,
            isArticleVisible: this.isArticleVisible,
            navigateBack: this.navigateBack,
            navigateTo: this.navigateTo,
            onSearch: this.onSearch,
            getCurrentArticle: this.getCurrentArticle,
            onButtonCloseClick: this.props.onButtonCloseClick,
            onWasHelpfulSubmit: this.props.onWasHelpfulSubmit,
            onWasHelpfulYesButtonClick: this.props.onWasHelpfulYesButtonClick,
            onWasHelpfulNoButtonClick: this.props.onWasHelpfulNoButtonClick,
            defaultContent: this.props.defaultContent,
            articleId: this.state.articleId,
          },
        }}
        children={this.props.children}
      />
    );
  }
}

export const HelpContextProvider = withAnalyticsEvents<Props>()(
  HelpContextProviderImplementation,
);

export const HelpContextConsumer = HelpContext.Consumer;

export const withHelp = <P extends Object>(
  WrappedComponent: React.ComponentType<P>,
) => (props: any) => (
  <HelpContext.Consumer>
    {({ help }) => {
      return <WrappedComponent {...props} help={help} />;
    }}
  </HelpContext.Consumer>
);
