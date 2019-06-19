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

import HelpPanel from '../src';

var client = algoliasearch('8K6J5OJIQW', 'c982b4b1a6ca921131d35edb63359b8c');
var index = client.initIndex('product_help_uat');

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
    const { isOpen } = this.state;
    return (
      <FlexContainer id="helpPanelExample">
        <ContentWrapper>
          <Page>
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
            <RightSidePanel isOpen={isOpen} attachPanelTo="helpPanelExample">
              <LocaleIntlProvider locale={'en'}>
                <HelpPanel
                  onBtnCloseClick={this.closeDrawer}
                  articleId="nbgju45fddcNAvvH9lhHc"
                  onGetArticle={this.onGetArticle}
                >
                  <h1>Default content</h1>
                </HelpPanel>
              </LocaleIntlProvider>
            </RightSidePanel>
          </Page>
        </ContentWrapper>
      </FlexContainer>
    );
  }
}
