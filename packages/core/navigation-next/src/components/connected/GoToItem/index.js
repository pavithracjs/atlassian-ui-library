// @flow

import React, { Component } from 'react';
import ArrowRightCircleIcon from '@atlaskit/icon/glyph/arrow-right-circle';
import Spinner from '@atlaskit/spinner';

import { withNavigationViewController } from '../../../view-controller';
import ConnectedItem from '../ConnectedItem';

import type { GoToItemProps, AfterComponentProps } from './types';
import type { ItemPresentationProps } from '../../presentational/Item/types';

const After = ({
  afterGoTo,
  spinnerDelay,
  incomingView,
  isActive,
  isHover,
  isFocused,
}: {
  ...ItemPresentationProps,
  ...AfterComponentProps,
}) => {
  if (incomingView && incomingView.id === afterGoTo) {
    return <Spinner delay={spinnerDelay} invertColor size="small" />;
  }
  if (isActive || isHover || isFocused) {
    return (
      <ArrowRightCircleIcon
        primaryColor="currentColor"
        secondaryColor="inherit"
      />
    );
  }
  return null;
};

class GoToItem extends Component<GoToItemProps> {
  static defaultProps = {
    spinnerDelay: 200,
  };

  handleClick = (e: SyntheticEvent<*>) => {
    const { goTo, navigationViewController } = this.props;

    e.preventDefault();

    if (typeof goTo !== 'string') {
      return;
    }

    navigationViewController.setView(goTo);
  };

  render() {
    const {
      after: afterProp,
      goTo,
      navigationViewController,
      spinnerDelay,
      ...rest
    } = this.props;
    const propsForAfterComp = {
      afterGoTo: goTo || null,
      spinnerDelay,
      incomingView: navigationViewController.state.incomingView,
    };
    const after = typeof afterProp === 'undefined' ? After : afterProp;
    const props = { ...rest, after };
    return (
      <ConnectedItem
        onClick={this.handleClick}
        {...props}
        {...propsForAfterComp}
      />
    );
  }
}

export { GoToItem as GoToItemBase };

export default withNavigationViewController(GoToItem);
