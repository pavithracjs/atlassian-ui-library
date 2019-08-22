import * as React from 'react';
import { Component } from 'react';
import HelpArticle from '@atlaskit/help-article';
import { Transition } from 'react-transition-group';
import { REQUEST_STATE } from '../../model/Requests';
import { withHelp, HelpContextInterface } from '../HelpContext';

import RelatedArticles from './RelatedArticles';
import ArticleWasHelpfulForm from './ArticleWasHelpfulForm';
import Loading from './Loading';
import LoadingError from './LoadingError';
import { ArticleContainer } from './styled';
import { TRANSITION_DURATION_MS, TRANSITION_STATUS } from '../constants';

const defaultStyle = {
  transition: `left ${TRANSITION_DURATION_MS}ms`,
  left: `100%`,
};

const transitionStyles: { [id: string]: React.CSSProperties } = {
  entered: { left: 0 },
  exited: { left: `100%` },
};

export interface Props {}

export interface State {
  skipArticleFadeInAnimation: boolean;
}

export class Article extends Component<Props & HelpContextInterface, State> {
  state = {
    article: this.props.help.getCurrentArticle(),
    skipArticleFadeInAnimation: false, // used as a flag to skip the first fade-in animation
  };

  constructor(props: Props & HelpContextInterface) {
    super(props);

    this.onArticleEntered = this.onArticleEntered.bind(this);
    this.renderArticleContent = this.renderArticleContent.bind(this);
  }

  componentDidMount() {
    // if helpContext.articleId is defined when this component is mounted,
    // set skipArticleFadeInAnimation = true to skip the initial slide-in
    this.setState({
      skipArticleFadeInAnimation:
        this.props.help.articleId !== '' ||
        this.props.help.articleId !== undefined,
    });
  }

  componentDidUpdate(prevProps: Props & HelpContextInterface) {
    // if an articleId is updated, then we don't need to skip the fade-in animation
    if (prevProps.help.articleId !== this.props.help.articleId) {
      this.setState({ skipArticleFadeInAnimation: false });
    }
  }

  onArticleEntered() {
    // if skipArticleFadeInAnimation is true, set to false after the
    // first slide-in animation
    // NOTE: skipArticleFadeInAnimation could be true only after the mounting
    const { skipArticleFadeInAnimation } = this.state;
    if (skipArticleFadeInAnimation) {
      this.setState({ skipArticleFadeInAnimation: false });
    }
  }

  renderArticleContent() {
    const article = this.props.help.getCurrentArticle();
    if (article) {
      if (article.state === REQUEST_STATE.done) {
        return (
          article.article && (
            <>
              <HelpArticle
                title={article.article.title}
                body={article.article.body}
                titleLinkUrl={article.article.productUrl}
              />
              <ArticleWasHelpfulForm />
              <RelatedArticles
                relatedArticles={article.article.relatedArticles}
              />
            </>
          )
        );
      }

      if (article.state === REQUEST_STATE.error) {
        return <LoadingError />;
      }

      return <Loading />;
    }

    return null;
  }

  render() {
    const { skipArticleFadeInAnimation } = this.state;

    return (
      <Transition
        in={this.props.help.isArticleVisible()}
        timeout={TRANSITION_DURATION_MS}
        enter={!skipArticleFadeInAnimation}
        onEntered={this.onArticleEntered}
        mountOnEnter
        unmountOnExit
      >
        {(state: TRANSITION_STATUS) => (
          <ArticleContainer
            isSearchVisible={this.props.help.isSearchVisible()}
            style={{
              ...defaultStyle,
              ...transitionStyles[state],
            }}
          >
            {this.renderArticleContent()}
          </ArticleContainer>
        )}
      </Transition>
    );
  }
}

export default withHelp(Article);
