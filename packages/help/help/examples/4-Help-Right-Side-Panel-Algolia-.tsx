import * as React from 'react';
import algoliasearch from 'algoliasearch';
import Button, { ButtonGroup } from '@atlaskit/button';
import Page from '@atlaskit/page';
import {
  RightSidePanel,
  FlexContainer,
  ContentWrapper,
} from '@atlaskit/right-side-panel';

import LocaleIntlProvider from '../example-helpers/LocaleIntlProvider';
import { ButtonsWrapper } from './utils/styled';

import Help from '../src';

var client = algoliasearch('8K6J5OJIQW', 'c982b4b1a6ca921131d35edb63359b8c');
var index = client.initIndex('product_help_uat');

export default class extends React.Component {
  state = {
    isOpen: false,
    searchText: 'test',
    articleId: '',
  };

  openDrawer = (articleId: string = '') =>
    this.setState({
      isOpen: true,
      articleId,
    });

  closeDrawer = () =>
    this.setState({
      isOpen: false,
    });

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
    const { isOpen, articleId } = this.state;
    return (
      <FlexContainer id="helpExample">
        <ContentWrapper>
          <Page>
            <ButtonsWrapper>
              <ButtonGroup>
                <Button type="button" onClick={() => this.openDrawer()}>
                  Open drawer - no ID
                </Button>

                <Button
                  type="button"
                  onClick={() => this.openDrawer('nbgju45fddcNAvvH9lhHc')}
                >
                  Open drawer - article 1
                </Button>

                <Button
                  type="button"
                  onClick={() => this.openDrawer('fkXjwybosO2ev4g5lLsZw')}
                >
                  Open drawer - article 2
                </Button>

                <Button
                  type="button"
                  onClick={() => this.openDrawer('11111111111111111111')}
                >
                  Open drawer - wrong id
                </Button>

                <Button type="button" onClick={this.closeDrawer}>
                  Close drawer
                </Button>
              </ButtonGroup>
            </ButtonsWrapper>
            <RightSidePanel isOpen={isOpen} attachPanelTo="helpExample">
              <LocaleIntlProvider locale={'en'}>
                <Help
                  onBtnCloseClick={this.closeDrawer}
                  articleId={articleId}
                  onGetArticle={this.onGetArticle}
                >
                  <span>Default content</span>
                </Help>
              </LocaleIntlProvider>
            </RightSidePanel>
          </Page>
        </ContentWrapper>
      </FlexContainer>
    );
  }
}
