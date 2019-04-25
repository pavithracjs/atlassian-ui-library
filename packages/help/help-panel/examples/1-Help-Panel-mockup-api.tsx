import * as React from 'react';
import Button from '@atlaskit/button';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import Page from '@atlaskit/page';

import { HelpPanel } from '../src';
import LocaleIntlProvider from '../example-helpers/LocaleIntlProvider';
import { Article, ArticleItem } from '../src/model/Article';
import { getArticle, searchArticle } from './utils/mockData';

const handleEvent = (analyticsEvent: { payload: any; context: any }) => {
  const { payload, context } = analyticsEvent;
  console.log('Received event:', { payload, context });
};

export default class extends React.Component {
  state = {
    isOpen: false,
    searchText: 'test',
  };

  openDrawer = () => {
    this.setState({
      isOpen: true,
    });
  };

  closeDrawer = () =>
    this.setState({
      isOpen: false,
    });

  onWasHelpfulSubmit = (value: string): Promise<boolean> => {
    console.log(value);
    return new Promise(resolve => setTimeout(() => resolve(true), 1000));
  };

  onSearchArticlesSubmit = (searchValue: any) => {
    this.setState({ searchText: searchValue });
  };

  onGetArticle = (articleId: string): Promise<Article> => {
    return new Promise(resolve =>
      setTimeout(() => resolve(getArticle(articleId)), 100),
    );
  };

  onSearch = (value: string): Promise<ArticleItem[]> => {
    return new Promise(resolve =>
      setTimeout(() => resolve(searchArticle(value)), 1000),
    );
  };

  render() {
    const { isOpen } = this.state;
    return (
      <div
        id="helpPanelExample"
        style={{
          display: 'flex',
          position: 'relative',
          width: '100%',
          height: '100%',
        }}
      >
        <Page>
          <AnalyticsListener channel="atlaskit" onEvent={handleEvent}>
            <LocaleIntlProvider locale={'en'}>
              <HelpPanel
                onWasHelpfulSubmit={this.onWasHelpfulSubmit}
                isOpen={isOpen}
                onBtnCloseClick={this.closeDrawer}
                articleId="00"
                onGetArticle={this.onGetArticle}
                onSearch={this.onSearch}
                attachPanelTo="helpPanelExample"
              >
                <h1>Default content</h1>
              </HelpPanel>
            </LocaleIntlProvider>

            <Button type="button" onClick={this.openDrawer}>
              Open drawer
            </Button>

            <Button type="button" onClick={this.closeDrawer}>
              Close drawer
            </Button>
          </AnalyticsListener>
        </Page>
      </div>
    );
  }
}
