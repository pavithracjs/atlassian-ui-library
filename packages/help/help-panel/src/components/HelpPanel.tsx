import * as React from 'react';
import {
  defaultAttributes,
  withAnalyticsContext,
  withAnalyticsEvents,
} from '../analytics';

import { HelpContextProvider } from './HelpContext';
import MessagesIntlProvider from './MessagesIntlProvider';

import HelpPanelContent from './HelpPanelContent';
import HelpPanelDrawer from './HelpPanelDrawer';
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
  // ID for the HTML tag where we want to attach the help-panel ("#app" by default)
  attachPanelTo?: string;
  // Default content. This prop is optional
  children?: React.ReactNode;
}

export class HelpPanel extends React.Component<Props> {
  render() {
    const { children, attachPanelTo, ...rest } = this.props;

    return (
      <HelpContextProvider {...rest} defaultContent={children}>
        <MessagesIntlProvider>
          <HelpPanelDrawer attachPanelTo={attachPanelTo}>
            <HelpPanelContent />
          </HelpPanelDrawer>
        </MessagesIntlProvider>
      </HelpContextProvider>
    );
  }
}

export default withAnalyticsContext(defaultAttributes)(
  withAnalyticsEvents()(HelpPanel),
);
