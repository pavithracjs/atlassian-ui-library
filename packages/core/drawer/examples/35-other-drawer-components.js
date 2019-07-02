// @flow

import React, { Component } from 'react';
import Button from '@atlaskit/button';
import Drawer, {
  DrawerSkeletonHeader,
  DrawerSkeletonItem,
  DrawerItemGroup,
  DrawerItem,
} from '../src';

type State = {
  isSkeletonVisible: boolean,
};

export default class DrawersExample extends Component<{}, State> {
  state = {
    isSkeletonVisible: true,
  };

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        isSkeletonVisible: false,
      });
    }, 1000);
  }

  toggleSkeleton = () =>
    this.setState({
      isSkeletonVisible: !this.state.isSkeletonVisible,
    });

  render() {
    return (
      <div css={{ padding: '2rem' }}>
        <Drawer isOpen width="wide">
          <h3>Use the toggle button at the bottom</h3>
          {this.state.isSkeletonVisible ? <Skeleton /> : <Items />}
          <Button
            css={{ position: 'absolute', bottom: '2rem' }}
            onClick={this.toggleSkeleton}
          >
            Toggle Skeleton
          </Button>
        </Drawer>
      </div>
    );
  }
}

const Items = () => (
  <>
    <DrawerItemGroup title="Lots of Items" isCompact>
      <DrawerItem>Item</DrawerItem>
      <DrawerItem>Item</DrawerItem>
      <DrawerItem>Item</DrawerItem>
      <DrawerItem>Item</DrawerItem>
      <DrawerItem>Item</DrawerItem>
      <DrawerItem>Item</DrawerItem>
      <DrawerItem>Item</DrawerItem>
      <DrawerItem>Item</DrawerItem>
    </DrawerItemGroup>
    <DrawerItemGroup title="More Items">
      <DrawerItem>Item</DrawerItem>
      <DrawerItem>Item</DrawerItem>
      <DrawerItem>Item</DrawerItem>
      <DrawerItem>Item</DrawerItem>
      <DrawerItem>Item</DrawerItem>
      <DrawerItem>Item</DrawerItem>
      <DrawerItem>Item</DrawerItem>
      <DrawerItem>Item</DrawerItem>
    </DrawerItemGroup>
    <DrawerItemGroup title="Even More Items">
      <DrawerItem>Item</DrawerItem>
      <DrawerItem>Item</DrawerItem>
      <DrawerItem>Item</DrawerItem>
      <DrawerItem>Item</DrawerItem>
      <DrawerItem>Item</DrawerItem>
      <DrawerItem>Item</DrawerItem>
      <DrawerItem>Item</DrawerItem>
      <DrawerItem>Item</DrawerItem>
    </DrawerItemGroup>
  </>
);
const Skeleton = () => (
  <>
    <DrawerSkeletonHeader isAvatarHidden />
    <DrawerSkeletonItem itemTextWidth="24rem" />
    <DrawerSkeletonItem itemTextWidth="24rem" />
    <DrawerSkeletonItem itemTextWidth="24rem" />
    <DrawerSkeletonItem itemTextWidth="24rem" />
    <DrawerSkeletonItem itemTextWidth="24rem" />
    <DrawerSkeletonItem itemTextWidth="24rem" />
  </>
);
