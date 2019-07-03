// @flow

import React, { Component } from 'react';
import Button from '@atlaskit/button';
import StarLargeIcon from '@atlaskit/icon/glyph/star-large';
import BoardIcon from '@atlaskit/icon/glyph/board';
import throttle from 'lodash.throttle';

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
        <Drawer isFocusLockEnabled={false} isOpen width="wide">
          <Button onClick={this.toggleSkeleton}>Toggle Skeleton</Button>
          {this.state.isSkeletonVisible ? <Skeleton /> : <Items />}
        </Drawer>
      </div>
    );
  }
}

const persister = ev => {
  ev.persist();
  logEvToConsole(ev);
};
const logEvToConsole = throttle(ev => {
  if (ev.type && ev.currentTarget) {
    ev.persist();
    console.log(
      `"${ev.type}" event triggered on Item with text "${
        ev.currentTarget.textContent
      }"`,
    );
  }
}, 250);
const commonProps = {
  onClick: persister,
  onKeyDown: persister,
  onMouseEnter: persister,
  onMouseLeave: persister,
  title: 'HTML title attribute',
};

const Items = () => (
  <>
    <DrawerItemGroup title="Lots of Items" isCompact>
      <DrawerItem
        {...commonProps}
        href="#link-to-nowhere"
        target="_blank"
        autoFocus
      >
        Anchor link that opens in a new tab
      </DrawerItem>
      <DrawerItem {...commonProps} description="Here be description">
        Item with description
      </DrawerItem>
      <DrawerItem {...commonProps} elemAfter={<StarLargeIcon />}>
        Item with elemAfter
      </DrawerItem>
      <DrawerItem {...commonProps} elemBefore={<BoardIcon />}>
        Item with elemBefore
      </DrawerItem>
      <DrawerItem {...commonProps} isCompact>
        Item isCompact
      </DrawerItem>
      <DrawerItem {...commonProps} isDisabled>
        Item isDisabled
      </DrawerItem>
      <DrawerItem {...commonProps} isSelected>
        Item isSelected
      </DrawerItem>
      <DrawerItem {...commonProps} isHidden>
        Item isHidden
      </DrawerItem>
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
