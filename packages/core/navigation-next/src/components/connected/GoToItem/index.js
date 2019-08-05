// @flow

// $FlowFixMe useContext
import React, { useContext } from 'react';
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

const GoToItem = (otherProps: GoToItemProps) => {
  const scrollProviderRef = useContext(ScrollProviderRef);
  const spinnerDelay = otherProps.spinnerDelay || 200;

  const handleClick = (
    e: SyntheticMouseEvent<*> | SyntheticKeyboardEvent<*>,
  ) => {
    const { goTo, navigationViewController } = otherProps;

    e.preventDefault();
    if (typeof goTo !== 'string') {
      return;
    }
    // Hijack focus only if the event is
    // from a keyboard.
    if (e.clientX === 0 && e.clientY === 0 && scrollProviderRef.current) {
      scrollProviderRef.current.focus();
    }

    navigationViewController.setView(goTo);
  };

  const {
    after: afterProp,
    goTo,
    navigationViewController,
    ...rest
  } = otherProps;

  const after = typeof afterProp === 'undefined' ? After : afterProp;
  const propsForAfterComp = {
    afterGoTo: otherProps.goTo || null,
    spinnerDelay,
    incomingView: otherProps.navigationViewController.state.incomingView,
  };

  const props = { ...rest, after, spinnerDelay };

  return (
    <ConnectedItem onClick={handleClick} {...props} {...propsForAfterComp} />
  );
};

export { GoToItem as GoToItemBase };
export default withNavigationViewController(GoToItem);
