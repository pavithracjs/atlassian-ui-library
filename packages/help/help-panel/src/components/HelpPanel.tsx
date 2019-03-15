import * as React from 'react';

import CloseButton from './CloseButton';
import GlobalHelpContent from './HelpPanelContent';
import GlobalHelpDrawer from './GlobalHelpDrawer';
import MessagesIntlProvider from './MessagesIntlProvider';
import { Article, ArticleItem } from '../model/Article';

export interface Props {
  // Open Close Drawer
  isOpen: boolean;
  onBtnCloseClick?(event: any): void; // If is undefined the close btn will not be displayed
  // Article
  articleId: string;
  onGetArticle(id: string): Article;
  // Search
  onSearch?(value: string): ArticleItem[];
}

export class HelpPanel extends React.Component<Props> {
  render() {
    const {
      isOpen,
      onGetArticle,
      articleId,
      onSearch,
      onBtnCloseClick,
    } = this.props;

    return (
      <MessagesIntlProvider>
        <GlobalHelpDrawer isOpen={isOpen}>
          <GlobalHelpContent
            isOpen={isOpen}
            articleId={articleId}
            onGetArticle={onGetArticle}
            onSearch={onSearch}
          />
          <CloseButton onBtnCloseClick={onBtnCloseClick} />
        </GlobalHelpDrawer>
      </MessagesIntlProvider>
    );
  }
}

export default HelpPanel;
