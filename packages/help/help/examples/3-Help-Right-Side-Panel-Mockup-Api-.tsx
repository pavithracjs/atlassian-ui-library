import * as React from 'react';
import Button, { ButtonGroup } from '@atlaskit/button';
import Page from '@atlaskit/page';
import {
  RightSidePanel,
  FlexContainer,
  ContentWrapper,
} from '@atlaskit/right-side-panel';

import LocaleIntlProvider from '../example-helpers/LocaleIntlProvider';
import { getArticle, searchArticle } from './utils/mockData';
import { ButtonsWrapper } from './utils/styled';

import Help from '../src';

export default class extends React.Component {
  state = {
    isOpen: false,
    searchText: 'test',
  };

  onWasHelpfulSubmit = (value: string): Promise<boolean> => {
    return new Promise(resolve => setTimeout(() => resolve(true), 1000));
  };

  openDrawer = () =>
    this.setState({
      isOpen: true,
    });

  closeDrawer = () =>
    this.setState({
      isOpen: false,
    });

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
    const { isOpen } = this.state;
    return (
      <FlexContainer id="helpExample">
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
            <RightSidePanel isOpen={isOpen} attachPanelTo="helpExample">
              <LocaleIntlProvider locale={'en'}>
                <Help
                  onBtnCloseClick={this.closeDrawer}
                  onWasHelpfulSubmit={this.onWasHelpfulSubmit}
                  articleId="00"
                  onGetArticle={this.onGetArticle}
                  onSearch={this.onSearch}
                >
                  <h1>Default content</h1>
                </Help>
              </LocaleIntlProvider>
            </RightSidePanel>
          </Page>
        </ContentWrapper>
      </FlexContainer>
    );
  }
}
