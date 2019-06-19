import * as React from 'react';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import Page from '@atlaskit/page';

import LocaleIntlProvider from '../example-helpers/LocaleIntlProvider';
import { getArticle, searchArticle } from './utils/mockData';
import { ExampleWrapper, HelpPanelWrapper } from './utils/styled';

import HelpPanel from '../src';

const handleEvent = (analyticsEvent: { payload: any; context: any }) => {
  const { payload, context } = analyticsEvent;
  console.log('Received event:', { payload, context });
};

export default class extends React.Component {
  state = {
    searchText: 'test',
  };

  onWasHelpfulSubmit = (value: string): Promise<boolean> => {
    return new Promise(resolve => setTimeout(() => resolve(true), 1000));
  };

  onSearchArticlesSubmit = (searchValue: any) => {
    this.setState({ searchText: searchValue });
  };

  onGetArticle = (articleId: string): Promise<any> => {
    return new Promise(resolve =>
      setTimeout(() => resolve(getArticle(articleId)), 100),
    );
  };

  onSearch = (value: string): Promise<any> => {
    return new Promise(resolve =>
      setTimeout(() => resolve(searchArticle(value)), 1000),
    );
  };

  render() {
    return (
      <ExampleWrapper id="helpPanelExample">
        <Page>
          <HelpPanelWrapper>
            <AnalyticsListener channel="atlaskit" onEvent={handleEvent}>
              <LocaleIntlProvider locale={'en'}>
                <HelpPanel>
                  <h1>Default content</h1>
                </HelpPanel>
              </LocaleIntlProvider>
            </AnalyticsListener>
          </HelpPanelWrapper>
        </Page>
      </ExampleWrapper>
    );
  }
}
