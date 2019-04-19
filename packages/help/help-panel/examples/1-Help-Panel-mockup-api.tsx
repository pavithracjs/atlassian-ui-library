import * as React from 'react';
import Button from '@atlaskit/button';
import { AnalyticsListener } from '@atlaskit/analytics-next';

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
      <AnalyticsListener channel="atlaskit" onEvent={handleEvent}>
        <div style={{ padding: '2rem' }}>
          <LocaleIntlProvider locale={'en'}>
            <HelpPanel
              isOpen={isOpen}
              onBtnCloseClick={this.closeDrawer}
              articleId="00"
              onGetArticle={this.onGetArticle}
              onSearch={this.onSearch}
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
        </div>
      </AnalyticsListener>
    );
  }
}
