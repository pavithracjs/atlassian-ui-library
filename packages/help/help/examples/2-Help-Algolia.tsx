import * as React from 'react';
import algoliasearch from 'algoliasearch';
import Page from '@atlaskit/page';

import LocaleIntlProvider from '../example-helpers/LocaleIntlProvider';
import { ExampleWrapper, HelpWrapper } from './utils/styled';

import Help from '../src';

var client = algoliasearch('8K6J5OJIQW', 'c982b4b1a6ca921131d35edb63359b8c');
var index = client.initIndex('product_help_uat');

export default class extends React.Component {
  state = {
    searchText: 'test',
  };

  onGetArticle = async (articleId: string): Promise<any> => {
    return new Promise((resolve, reject) => {
      index.getObjects([articleId], function(err, content) {
        if (err) {
          reject(err);
        }

        const article = content.results[0];
        resolve(article);
      });
    });
  };

  render() {
    return (
      <ExampleWrapper>
        <Page>
          <HelpWrapper>
            <LocaleIntlProvider locale={'en'}>
              <Help
                articleId="nbgju45fddcNAvvH9lhHc"
                onGetArticle={this.onGetArticle}
              >
                <span>Default content</span>
              </Help>
            </LocaleIntlProvider>
          </HelpWrapper>
        </Page>
      </ExampleWrapper>
    );
  }
}
