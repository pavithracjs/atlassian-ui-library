// @flow

import React, { Children, Component, Fragment, type Node } from 'react';
import { canUseDOM } from 'exenv';
import Portal from '@atlaskit/portal';
import { ThemeProvider } from 'styled-components';
import { TransitionGroup, Transition } from 'react-transition-group';
import {
  createAndFireEvent,
  withAnalyticsEvents,
  withAnalyticsContext,
  type WithAnalyticsEventsProps,
} from '@atlaskit/analytics-next';
import Blanket from '@atlaskit/blanket';
import {
  name as packageName,
  version as packageVersion,
} from '../version.json';
import drawerItemTheme from '../theme/drawer-item-theme';
import FocusLock from './focus-lock';
import DrawerPrimitive from './primitives';
import { Fade } from './transitions';
import type { CloseTrigger, DrawerProps } from './types';

const OnlyChild = ({ children }) => Children.toArray(children)[0] || null;

const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

const createAndFireOnClick = (
  createAnalyticsEvent: $PropertyType<
    WithAnalyticsEventsProps,
    'createAnalyticsEvent',
  >,
  trigger: CloseTrigger,
) =>
  createAndFireEventOnAtlaskit({
    action: 'dismissed',
    actionSubject: 'drawer',
    attributes: {
      componentName: 'drawer',
      packageName,
      packageVersion,
      trigger,
    },
  })(createAnalyticsEvent);

export class DrawerBase extends Component<
  DrawerProps,
  { renderPortal: boolean },
> {
  static defaultProps = {
    width: 'narrow',
    isFocusLockEnabled: true,
    shouldReturnFoucs: true,
  };

  state = {
    renderPortal: false,
  };

  body = canUseDOM ? document.querySelector('body') : undefined;

  componentDidMount() {
    const { isOpen } = this.props;

    if (isOpen) {
      window.addEventListener('keydown', this.handleKeyDown);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
  }

  componentDidUpdate(prevProps: DrawerProps) {
    const { isOpen } = this.props;
    if (isOpen !== prevProps.isOpen) {
      if (isOpen) {
        window.addEventListener('keydown', this.handleKeyDown);
      } else {
        window.removeEventListener('keydown', this.handleKeyDown);
      }
    }
  }

  handleBlanketClick = (event: SyntheticMouseEvent<*>) => {
    this.handleClose(event, 'blanket');
  };

  handleBackButtonClick = (event: SyntheticMouseEvent<*>) => {
    this.handleClose(event, 'backButton');
  };

  handleClose = (
    event: SyntheticKeyboardEvent<*> | SyntheticMouseEvent<*>,
    trigger: CloseTrigger,
  ) => {
    const { createAnalyticsEvent, onClose } = this.props;

    const analyticsEvent = createAndFireOnClick(createAnalyticsEvent, trigger);

    if (onClose) {
      onClose(event, analyticsEvent);
    }
  };

  handleKeyDown = (event: SyntheticKeyboardEvent<*>) => {
    const { isOpen, onKeyDown } = this.props;

    if (event.key === 'Escape' && isOpen) {
      this.handleClose(event, 'escKey');
    }
    if (onKeyDown) {
      onKeyDown(event);
    }
  };

  render() {
    if (!this.body) {
      return null;
    }
    const {
      isOpen,
      children,
      icon,
      width,
      shouldUnmountOnExit,
      onCloseComplete,
      autoFocusFirstElem,
      isFocusLockEnabled,
      shouldReturnFoucs,
    } = this.props;

    return (
      <Transition
        in={isOpen}
        timeout={{ enter: 0, exit: 220 }}
        mountOnEnter
        unmountOnExit
      >
        <Portal zIndex="unset">
          <TransitionGroup component={OnlyChild}>
            <Fragment>
              {/* $FlowFixMe the `in` prop is internal */}
              <Fade in={isOpen}>
                <Blanket isTinted onBlanketClicked={this.handleBlanketClick} />
              </Fade>
              <FocusLock
                autoFocus={autoFocusFirstElem}
                isEnabled={isFocusLockEnabled}
                shouldReturnFoucs={shouldReturnFoucs}
              >
                <DrawerPrimitive
                  icon={icon}
                  in={isOpen}
                  onClose={this.handleBackButtonClick}
                  onCloseComplete={onCloseComplete}
                  width={width}
                  shouldUnmountOnExit={shouldUnmountOnExit}
                >
                  {children}
                </DrawerPrimitive>
              </FocusLock>
            </Fragment>
          </TransitionGroup>
        </Portal>
      </Transition>
    );
  }
}

export const DrawerItemTheme = (props: { children: Node }) => (
  <ThemeProvider theme={drawerItemTheme}>{props.children}</ThemeProvider>
);

export * from './skeletons';
export * from './item-group';
export * from './item';

export default withAnalyticsContext({
  componentName: 'drawer',
  packageName,
  packageVersion,
})(withAnalyticsEvents()(DrawerBase));
