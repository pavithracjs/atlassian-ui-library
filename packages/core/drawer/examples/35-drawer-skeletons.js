// @flow

import React, { Component } from 'react';

import { DrawerSkeletonHeader, DrawerSkeletonItem } from '../src';

export default class DrawersExample extends Component<{}> {
  render() {
    return (
      <div css={{ width: '40rem' }}>
        <DrawerSkeletonHeader isAvatarHidden />
        <DrawerSkeletonItem itemTextWidth="24rem" />
        <DrawerSkeletonItem itemTextWidth="24rem" />
        <DrawerSkeletonItem itemTextWidth="24rem" />
        <DrawerSkeletonItem itemTextWidth="24rem" />
        <DrawerSkeletonItem itemTextWidth="24rem" />
        <DrawerSkeletonItem itemTextWidth="24rem" />
      </div>
    );
  }
}
