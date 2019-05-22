import React, { Component } from 'react';
import Button from '@atlaskit/button';
import Drawer from '../src';
import { DrawerWidth } from '../src/components/types';
import { widths } from '../src/constants';

type State = {
  isDrawerOpen: boolean;
  width: DrawerWidth;
};

export default class DrawersExample extends Component<{}, State> {
  state: State = {
    isDrawerOpen: false,
    width: 'narrow',
  };

  openDrawer = (width: DrawerWidth) => () =>
    this.setState({
      isDrawerOpen: true,
      width,
    });

  closeDrawer = () =>
    this.setState({
      isDrawerOpen: false,
    });

  render() {
    return (
      <div css={{ padding: '2rem' }}>
        <Drawer
          onClose={this.closeDrawer}
          isOpen={this.state.isDrawerOpen}
          width={this.state.width}
        >
          <code
            css={{
              textTransform: 'capitalize',
            }}
          >{`${this.state.width} drawer contents`}</code>
        </Drawer>
        {widths.map(width => (
          <Button
            onClick={this.openDrawer(width as DrawerWidth)}
            type="button"
            key={width}
            id={`open-${width}-drawer`}
            css={{
              marginRight: '1rem',
            }}
          >{`Open ${width} Drawer`}</Button>
        ))}
      </div>
    );
  }
}
