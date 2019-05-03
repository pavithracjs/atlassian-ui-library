// @flow

import React, { Component } from 'react';
import Button from '@atlaskit/button';
import Item from '@atlaskit/item';
import Drawer, {
  DrawerSkeletonHeader,
  DrawerSkeletonItem,
  DrawerItemGroup,
} from '../src';

type State = {
  isSkeletonVisible: boolean,
};

export default class DrawersExample extends Component<{}, State> {
  state = {
    isSkeletonVisible: true,
  };

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
      <Item>Item</Item>
      <Item>Item</Item>
      <Item>Item</Item>
      <Item>Item</Item>
      <Item>Item</Item>
      <Item>Item</Item>
      <Item>Item</Item>
      <Item>Item</Item>
    </DrawerItemGroup>
    <DrawerItemGroup title="More Items">
      <Item>Item</Item>
      <Item>Item</Item>
      <Item>Item</Item>
      <Item>Item</Item>
      <Item>Item</Item>
      <Item>Item</Item>
      <Item>Item</Item>
      <Item>Item</Item>
    </DrawerItemGroup>
    <DrawerItemGroup title="Even More Items">
      <Item>Item</Item>
      <Item>Item</Item>
      <Item>Item</Item>
      <Item>Item</Item>
      <Item>Item</Item>
      <Item>Item</Item>
      <Item>Item</Item>
      <Item>Item</Item>
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
