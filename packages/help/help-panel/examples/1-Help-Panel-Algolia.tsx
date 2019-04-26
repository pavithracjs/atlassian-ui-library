import * as React from 'react';
import algoliasearch from 'algoliasearch';
import Button, { ButtonGroup } from '@atlaskit/button';
import Page from '@atlaskit/page';

import LocaleIntlProvider from '../example-helpers/LocaleIntlProvider';
import { Article } from '../src/model/Article';
import { ExampleWrapper, ButtonsWrapper } from './utils/styled';

import { HelpPanel } from '../src';

var client = algoliasearch('8K6J5OJIQW', 'c982b4b1a6ca921131d35edb63359b8c');
var index = client.initIndex('dev_spike_test');

export default class extends React.Component {
  state = {
    isOpen: false,
    searchText: 'test',
  };

  openDrawer = () =>
    this.setState({
      isOpen: true,
    });

  closeDrawer = () =>
    this.setState({
      isOpen: false,
    });

  onGetArticle = async (articleId: string): Promise<Article> => {
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
    const { isOpen } = this.state;
    return (
      <ExampleWrapper id="helpPanelExample">
        <Page>
          <LocaleIntlProvider locale={'en'}>
            <HelpPanel
              isOpen={isOpen}
              onBtnCloseClick={this.closeDrawer}
              articleId="kzkHVoTKjp72azitT1Hwv"
              onGetArticle={this.onGetArticle}
              attachPanelTo="helpPanelExample"
            >
              <h1>Default content</h1>
            </HelpPanel>
          </LocaleIntlProvider>
          <ButtonsWrapper>
            <ButtonGroup>
              <Button type="button" onClick={this.openDrawer}>
                Open drawer
              </Button>

              <Button type="button" onClick={this.closeDrawer}>
                Close drawer
              </Button>
            </ButtonGroup>
          </ButtonsWrapper>
        </Page>
      </ExampleWrapper>
    );
  }
}
