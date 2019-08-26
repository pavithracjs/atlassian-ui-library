import * as React from 'react';
import {
  withAnalyticsEvents,
  WithAnalyticsEventsProps,
  withAnalyticsContext,
  UIAnalyticsEvent,
} from '@atlaskit/analytics-next';
import { defaultAnalyticsAttributes } from '../analytics';
import { Article, ArticleItem, ArticleFeedback } from '../model/Article';
import { HelpContextProvider } from './HelpContext';
import MessagesIntlProvider from './MessagesIntlProvider';

import HelpContent from './HelpContent';

export interface Props extends WithAnalyticsEventsProps {
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
  // Event handler for the "Was this helpful" submits button. This prop is optional, if is not defined the "Was this helpful" section will be hidden
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
  children?: React.ReactNode;
}

export class Help extends React.Component<Props> {
  render() {
    const { children, ...rest } = this.props;

    return (
      <HelpContextProvider {...rest} defaultContent={children}>
        <MessagesIntlProvider>
          <HelpContent />
        </MessagesIntlProvider>
      </HelpContextProvider>
    );
  }
}

export default withAnalyticsContext(defaultAnalyticsAttributes)(
  withAnalyticsEvents()(Help),
);
