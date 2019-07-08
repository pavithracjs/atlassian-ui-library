import * as React from 'react';
import {
  md,
  code,
  Example,
  Props,
  AtlassianInternalWarning,
  DevPreviewWarning,
} from '@atlaskit/docs';

export default md`
  ${(
    <>
      <div style={{ marginBottom: '0.5rem' }}>
        <AtlassianInternalWarning />
      </div>
      <div style={{ marginTop: '0.5rem' }}>
        <DevPreviewWarning />
      </div>
    </>
  )}

  ## Usage

  ${code`
  import * as React from 'react';
  import { AnalyticsListener } from '@atlaskit/analytics-next';
  import Page from '@atlaskit/page';
  
  import LocaleIntlProvider from '../example-helpers/LocaleIntlProvider';
  import { getArticle, searchArticle } from './utils/mockData';
  import { ExampleWrapper, HelpWrapper } from './utils/styled';
  
  import Help from '../src';
  
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
        <ExampleWrapper>
          <Page>
            <HelpWrapper>
              <AnalyticsListener channel="atlaskit" onEvent={handleEvent}>
                <LocaleIntlProvider locale={'en'}>
                  <Help
                    onWasHelpfulSubmit={this.onWasHelpfulSubmit}
                    articleId="00"
                    onGetArticle={this.onGetArticle}
                    onSearch={this.onSearch}
                  >
                    <h1>Default content</h1>
                  </Help>
                </LocaleIntlProvider>
              </AnalyticsListener>
            </HelpWrapper>
          </Page>
        </ExampleWrapper>
      );
    }
  }  
  `}

  ${(
    <Example
      Component={require('../examples/0-Help-Mockup-Api').default}
      title="Help"
      source={require('!!raw-loader!../examples/0-Help-Mockup-Api')}
    />
  )}

  ${(
    <Props
      props={require('!!extract-react-types-loader!../src/components/Help')}
    />
  )}
`;
