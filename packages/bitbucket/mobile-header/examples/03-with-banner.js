// @flow

import React, { Component } from 'react';
import styled from 'styled-components';
import Button from '@atlaskit/button';
import Banner from '@atlaskit/banner';
import Navigation from '@atlaskit/navigation';
import RoomMenuIcon from '@atlaskit/icon/glyph/room-menu';
import WarningIcon from '@atlaskit/icon/glyph/warning';
import MobileHeader from '../src';

const BANNER_HEIGHT = 52;

const FakeSideBar = styled.div`
  background-color: white;
  height: 100vh;
  padding-top: 32px;
  text-align: center;
  width: 264px;
`;

type State = {
  drawerState: 'navigation' | 'sidebar' | 'none',
};

export default class BannerMobileHeaderDemo extends Component<*, State> {
  state = {
    drawerState: 'none',
  };

  navOpened = () => {
    this.setState({ drawerState: 'navigation' });
  };

  sidebarOpened = () => {
    this.setState({ drawerState: 'sidebar' });
  };

  drawerClosed = () => {
    this.setState({ drawerState: 'none' });
  };

  render() {
    return (
      <div>
        <Banner
          isOpen
          icon={<WarningIcon label="Warning icon" secondaryColor="inherit" />}
        >
          This is a warning banner
        </Banner>
        <MobileHeader
          drawerState={this.state.drawerState}
          menuIconLabel="Menu"
          navigation={isOpen => isOpen && <Navigation onResize={() => {}} />}
          secondaryContent={
            <Button
              iconBefore={<RoomMenuIcon label="Show sidebar" />}
              onClick={this.sidebarOpened}
            />
          }
          sidebar={isOpen =>
            isOpen && <FakeSideBar>Sidebar goes here...</FakeSideBar>
          }
          pageHeading="Page heading"
          onNavigationOpen={this.navOpened}
          onSidebarOpen={this.sidebarOpened}
          onDrawerClose={this.drawerClosed}
          topOffset={BANNER_HEIGHT}
        />
      </div>
    );
  }
}
