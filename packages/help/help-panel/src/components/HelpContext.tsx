import React, { createContext } from 'react';
import { Article, ArticleItem } from '../model/Article';
import { REQUEST_STATE } from '../model/Resquests';

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
  article: Article | null | undefined; // Article to display, if is empty the default content should be displayed
  articleState: REQUEST_STATE;
  history: [Article | string]; // holds all the articles ID the user has navigated
  // Search
  searchValue: string;
  searchResult: ArticleItem[];
  searchState: REQUEST_STATE;
}

export interface HelpContextInterface {
  view: VIEW;
  isOpen: boolean;
  onBtnCloseClick?(onBtnCloseClick: React.MouseEvent<HTMLElement>): void;
  article: Article | null | undefined; // Article to display, if is empty the default content should be displayed
  articleState: REQUEST_STATE;
  history: string[]; // holds all the articles ID the user has navigated
  defaultContent?: React.ReactNode;
  navigateBack: void;
  onWasHelpfulSubmit?(value: any): Promise<boolean>;
  onSearch: void;
  searchResult: ArticleItem[];
  searchState: REQUEST_STATE;
  searchValue: string;
}

const defaultValues = {
  view: VIEW.DEFAULT_CONTENT,
  defaultContent: undefined,
  // Article
  article: undefined, // Article to display, if is empty the default content should be displayed
  articleState: REQUEST_STATE.done,
  history: [], // holds all the articles ID the user has navigated
  // Search
  searchValue: '',
  searchResult: [],
  searchState: REQUEST_STATE.done,
};

const initialiseHelpData = data => {
  return Object.assign(defaultValues, data);
};

const HelpContext = createContext({});

export class HelpContextProvider extends React.Component<Props, State> {
  constructor(props) {
    super(props);

    this.state = initialiseHelpData(props.defaultValues);
  }

  componentDidMount() {
    window.history.pushState = function(this: HelpContextProvider, e) {
      PUSH_STATE.apply(window.history, arguments);
      this.onUrlChange(window.location);
    }.bind(this);
  }

  async componentDidUpdate(prevProps) {
    const { articleId, onGetArticle } = this.props;
    // When the drawer goes from close to open
    // and the articleId is defined, get the content of that article
    if (this.props.isOpen !== prevProps.isOpen && articleId) {
      const article = await this.getArticle(articleId, onGetArticle);
      this.setState({ article, view: VIEW.ARTICLE });
    }
  }

  onUrlChange(newLocation: Location) {
    if (!this.props.isOpen) {
      console.log(newLocation.pathname);
      // this.getArticle(newLocation.pathname);
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
          console.log(searchResult);
          this.setState({
            searchResult,
            searchState: REQUEST_STATE.done,
            // view: VIEW.SEARCH_RESULT,
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

  getArticle = async (
    articleId: string,
    onGetArticle: ((id: string) => Promise<Article>) | undefined,
  ) => {
    // Execute this function only if onGetArticle was defined
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
  };

  navigateBack = async () => {
    console.log(`navigateBack`);
  };

  isSearchVisible = () => {
    return this.state.view === VIEW.ARTICLE && this.props.onSearch;
  };

  isArticleVisible = () => {
    return (
      this.state.view === VIEW.ARTICLE &&
      this.state.searchValue.length <= MIN_CHARACTERS_FOR_SEARCH
    );
  };

  render() {
    return (
      <HelpContext.Provider
        value={{
          ...this.state,
          isOpen: this.props.isOpen,
          isSearchVisible: this.isSearchVisible,
          isArticleVisible: this.isArticleVisible,
          navigateBack: this.navigateBack,
          onSearch: this.onSearch,
          onBtnCloseClick: this.props.onBtnCloseClick,
          onWasHelpfulSubmit: this.props.onWasHelpfulSubmit,
        }}
        children={this.props.children}
      />
    );
  }
}

export const HelpContextConsumer = HelpContext.Consumer;

export const withHelp = WrappedComponent => {
  return class ComponentWithHelp extends React.Component {
    static displayName = `withHelp(${WrappedComponent.displayName ||
      WrappedComponent.name})`;

    render() {
      return (
        <HelpContext.Consumer>
          {help => <WrappedComponent {...this.props} help={help} />}
        </HelpContext.Consumer>
      );
    }
  };
};
