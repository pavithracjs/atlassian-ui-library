// @flow

import React, { Component } from 'react';
import Button from '@atlaskit/button';
import Drawer from '../src';

type State = {
  isDrawerOpen: boolean,
  isSecondDrawerOpen: boolean,
};
export default class DrawersExample extends Component<{}, State> {
  state = {
    isDrawerOpen: false,
    isSecondDrawerOpen: false,
  };

  openDrawer = () =>
    this.setState({
      isDrawerOpen: true,
    });

  onClose = () => {
    this.setState({
      isDrawerOpen: false,
    });
  };

  openSecondDrawer = () =>
    this.setState({
      isSecondDrawerOpen: true,
    });

  onSecondClose = () => {
    this.setState({
      isSecondDrawerOpen: false,
    });
  };

  render() {
    return (
      <div css={{ padding: '2rem' }}>
        <Drawer
          onClose={this.onSecondClose}
          isOpen={this.state.isSecondDrawerOpen}
          width="extended"
          zIndex={2}
        >
          <div
            css={{
              height: '90vh',
              padding: '2rem',
              backgroundColor: 'aliceblue',
            }}
          >
            Drawer over drawer
          </div>
        </Drawer>
        <Drawer
          onClose={this.onClose}
          isOpen={this.state.isDrawerOpen}
          width="wide"
          zIndex={1}
        >
          <div
            css={{ height: '90vh', padding: '2rem', backgroundColor: 'beige' }}
          >
            <Button
              id="open-second-drawer"
              type="button"
              onClick={this.openSecondDrawer}
            >
              Open another drawer on top
            </Button>
          </div>
        </Drawer>
        <Button id="open-drawer" type="button" onClick={this.openDrawer}>
          Open drawer
        </Button>
      </div>
    );
  }
}
