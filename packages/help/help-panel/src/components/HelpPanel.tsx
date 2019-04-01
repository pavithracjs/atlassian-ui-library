import * as React from 'react';

import { HelpContextProvider } from './HelpContext';
import GlobalHelpContent from './HelpPanelContent';
import GlobalHelpDrawer from './GlobalHelpDrawer';
import MessagesIntlProvider from './MessagesIntlProvider';
import { Article, ArticleItem } from '../model/Article';

export interface Props {
  // Open/Closed drawer state
  isOpen: boolean;
  // Event handler for the close button. This prop is optional, if this function is not defined the close button will not be displayed
  onBtnCloseClick?(event: any): void;
  // Id of the article to display. This prop is optional, if is not defined the default content will be displayed
  articleId?: string;
  // Function used to get an article content. This prop is optional, if is not defined the default content will be displayed
  onGetArticle?(id: string): Promise<Article>;
  // Function used to search an article.  This prop is optional, if is not defined search input will be hidden
  onSearch?(value: string): Promise<ArticleItem[]>;
  // Function used when the user submits the "Was this helpful" form. This prop is optional, if is not defined the "Was this helpful" section will be hidden
  onWasHelpfulSubmit?(value: any): Promise<boolean>;
  // Default content. This prop is optional
  children?: React.ReactNode;
}

export class HelpPanel extends React.Component<Props> {
  render() {
    const { children, ...rest } = this.props;

    return (
      <HelpContextProvider {...rest} defaultContent={children}>
        <MessagesIntlProvider>
          <GlobalHelpDrawer>
            <GlobalHelpContent />
          </GlobalHelpDrawer>
        </MessagesIntlProvider>
      </HelpContextProvider>
    );
  }
}

export default HelpPanel;
