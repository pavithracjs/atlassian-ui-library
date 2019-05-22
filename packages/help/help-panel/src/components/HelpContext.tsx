import React, { createContext } from 'react';
import { createAndFire, withAnalyticsEvents } from '../analytics';
import { CreateUIAnalyticsEventSignature } from '@atlaskit/analytics-next';

import { Analytics } from '../model/Analytics';
import { Article, ArticleItem, ArticleFeedback } from '../model/Article';
import { REQUEST_STATE } from '../model/Requests';

import { MIN_CHARACTERS_FOR_SEARCH, VIEW } from './constants';

/**
 * Saved the original 'window.history.pushState' function in this const because I'm going to modify it
 * when the component is mounted, so when the component gets dismounted I'll use this copy to get
 * 'window.history.pushState' back to the default implementation
 */
const PUSH_STATE = window.history.pushState;

export interface Props {
  // Open/Closed drawer state
  isOpen: boolean;
  // Event handler for the close button. This prop is optional, if this function is not defined the close button will not be displayed
  onBtnCloseClick?(onBtnCloseClick: React.MouseEvent<HTMLElement>): void;
  // Id of the article to display. This prop is optional, if is not defined the default content will be displayed
  articleId?: string;
  // Function used to get an article content. This prop is optional, if is not defined the default content will be displayed
  onGetArticle?(id: string): Promise<Article>;
  // Function used to search an article.  This prop is optional, if is not defined search input will be hidden
  onSearch?(value: string): Promise<ArticleItem[]>;
  // Function used when the user submits the "Was this helpful" form. This prop is optional, if is not defined the "Was this helpful" section will be hidden
  onWasHelpfulSubmit?(value: any): Promise<boolean>;
  // Default content. This prop is optional
  defaultContent?: React.ReactNode;
}

export interface State {
  // Open/Closed drawer state
  view: VIEW;
  defaultContent?: React.ReactNode;
  // Article
  defaultArticle: Article | null | undefined; // Article to display, if is empty the default content should be displayed
  articleState: REQUEST_STATE;
  history: Article[]; // holds all the articles ID the user has navigated
  // Search
  searchValue: string;
  searchResult: ArticleItem[];
  searchState: REQUEST_STATE;
}

export interface HelpContextInterface {
  help: {
    view: VIEW;
    isOpen: boolean;
    isSearchVisible(): boolean;
    isArticleVisible(): boolean;
    getCurrentArticle(): Article | null;
    onBtnCloseClick?(onBtnCloseClick: React.MouseEvent<HTMLElement>): void;
    defaultArticle: Article | null | undefined; // Article to display, if is empty the default content should be displayed
    articleState: REQUEST_STATE;
    history: Article[]; // holds all the articles ID the user has navigated
    defaultContent?: React.ReactNode;
    navigateBack(): void;
    navigateTo(id: string): void;
    onWasHelpfulSubmit?(value: ArticleFeedback): Promise<boolean>;
    onSearch(value: string): void;
    searchResult: ArticleItem[];
    searchState: REQUEST_STATE;
    searchValue: string;
  };
}

const defaultValues = {
  view: VIEW.DEFAULT_CONTENT,
  defaultContent: undefined,
  // Article
  defaultArticle: undefined, // Article to display, if is empty the default content should be displayed
  articleState: REQUEST_STATE.done,
  history: [], // holds all the articles ID the user has navigated
  // Search
  searchValue: '',
  searchResult: [],
  searchState: REQUEST_STATE.done,
};

const initialiseHelpData = (data: State) => {
  return Object.assign(defaultValues, data);
};

const HelpContext = createContext<Partial<HelpContextInterface>>({});

class HelpContextProviderImplementation extends React.Component<
  Props &
    Analytics & {
      createAnalyticsEvent: CreateUIAnalyticsEventSignature;
    },
  State
> {
  constructor(
    props: Props &
      Analytics & {
        createAnalyticsEvent: CreateUIAnalyticsEventSignature;
      },
  ) {
    super(props);

    this.state = initialiseHelpData(defaultValues);
  }

  async componentDidMount() {
    const { articleId, isOpen } = this.props;

    window.history.pushState = function(
      this: HelpContextProviderImplementation,
    ) {
      PUSH_STATE.apply(window.history, arguments);
    };

    // if the initial value of isOpen is true, fire analytics event and
    // request the article
    if (isOpen) {
      createAndFire({
        action: 'help-panel-open',
      })(this.props.createAnalyticsEvent);

      if (articleId) {
        const article = await this.getArticle(articleId);
        this.setState({ defaultArticle: article, view: VIEW.ARTICLE });
      }
    }
  }

  async componentDidUpdate(prevProps: Props) {
    const { articleId } = this.props;

    if (this.props.isOpen && this.props.isOpen !== prevProps.isOpen) {
      createAndFire({
        action: 'help-panel-open',
      })(this.props.createAnalyticsEvent);
    }
    // When the drawer goes from close to open
    // and the articleId is defined, get the content of that article
    if (
      (this.props.isOpen !== prevProps.isOpen && articleId) ||
      (articleId !== prevProps.articleId && articleId)
    ) {
      const article = await this.getArticle(articleId);
      this.setState({ defaultArticle: article, view: VIEW.ARTICLE });
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
        this.setState({ searchState: REQUEST_STATE.loading });
        try {
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

  getArticle = async (articleId: string) => {
    // Execute this function only if onGetArticle was defined
    const { onGetArticle } = this.props;
    if (onGetArticle) {
      this.setState({ articleState: REQUEST_STATE.loading });
      try {
        const article = await onGetArticle(articleId);
        this.setState({ articleState: REQUEST_STATE.done });
        return article;
      } catch (error) {
        this.setState({ articleState: REQUEST_STATE.error });
      }
    }

    return null;
  };

  navigateBack = async () => {
    if (this.state.history.length > 0 && this.state.history !== undefined) {
      this.setState(prevState => {
        const newState = { history: [...prevState.history.slice(0, -1)] };
        const historyLastItem = newState.history[newState.history.length - 1];
        if (historyLastItem) {
          const id = historyLastItem.id;

          createAndFire({
            action: 'help-panel-article-changed',
            attributes: { id },
          })(this.props.createAnalyticsEvent);
        }

        return newState;
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
        action: 'help-panel-article-changed',
        attributes: { id },
      })(this.props.createAnalyticsEvent);
    }
  };

  isSearchVisible = (): boolean => {
    if (this.props.onSearch) {
      return this.state.view === VIEW.ARTICLE;
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
    } else if (
      this.state.defaultArticle !== undefined &&
      this.state.defaultArticle !== null
    ) {
      return this.state.defaultArticle;
    } else {
      return null;
    }
  };

  render() {
    return (
      <HelpContext.Provider
        value={{
          help: {
            ...this.state,
            isOpen: this.props.isOpen,
            isSearchVisible: this.isSearchVisible,
            isArticleVisible: this.isArticleVisible,
            navigateBack: this.navigateBack,
            navigateTo: this.navigateTo,
            onSearch: this.onSearch,
            getCurrentArticle: this.getCurrentArticle,
            onBtnCloseClick: this.props.onBtnCloseClick,
            onWasHelpfulSubmit: this.props.onWasHelpfulSubmit,
            defaultContent: this.props.defaultContent,
          },
        }}
        children={this.props.children}
      />
    );
  }
}

export const HelpContextProvider = withAnalyticsEvents()(
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
