// @flow

import React, { Component, type ComponentType } from 'react';
import ArrowRightCircleIcon from '@atlaskit/icon/glyph/arrow-right-circle';
import Spinner from '@atlaskit/spinner';

import { withNavigationViewController } from '../../../view-controller';
import ConnectedItem from '../ConnectedItem';

import { ScrollProviderRef } from '../../presentational/ContentNavigation/primitives';
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

class GoToItem extends Component<GoToItemProps | ScrollProviderRefProps> {
  static defaultProps = {
    spinnerDelay: 200,
  };

  handleClick = (e: SyntheticMouseEvent<*> | SyntheticKeyboardEvent<*>) => {
    const { goTo, navigationViewController } = this.props;

    e.preventDefault();

    if (typeof goTo !== 'string') {
      return;
    }

    const scrollProviderRef = this.props.scrollProviderRef.current;
    // Hijack focus only if the event is
    // from a keyboard.
    if (e.clientX === 0 && e.clientY === 0 && scrollProviderRef) {
      scrollProviderRef.focus();
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

type Ref = {| current: any |};
type ScrollProviderRefProps = {|
  scrollProviderRef: Ref,
|};
const withScrollProviderRef = (Children: ComponentType<GoToItem>) => {
  return class extends Component<GoToItemProps | ScrollProviderRefProps> {
    render() {
      return (
        <ScrollProviderRef.Consumer>
          {ref => <Children scrollProviderRef={ref} {...this.props} />}
        </ScrollProviderRef.Consumer>
      );
    }
  };
};
const GoToItemBase = withScrollProviderRef(GoToItem);

export { GoToItemBase };
export default withNavigationViewController(GoToItemBase);
