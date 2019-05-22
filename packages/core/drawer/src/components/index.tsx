import React, {
  Children,
  Component,
  Fragment,
  FC,
  SyntheticEvent,
} from 'react';
import { canUseDOM } from 'exenv';
import Portal from '@atlaskit/portal';
import { ThemeProvider } from 'styled-components';
import { TransitionGroup } from 'react-transition-group';
import {
  createAndFireEvent,
  withAnalyticsEvents,
  withAnalyticsContext,
  CreateUIAnalyticsEventSignature,
} from '@atlaskit/analytics-next';
import Blanket from '@atlaskit/blanket';
import {
  name as packageName,
  version as packageVersion,
} from '../version.json';
import drawerItemTheme from '../theme/drawer-item-theme';
import DrawerPrimitive from './primitives';
import { Fade } from './transitions';
import { CloseTrigger, DrawerProps } from './types';

const OnlyChild: FC<any> = ({ children }) =>
  Children.toArray(children)[0] || null;

const createAndFireEventOnAtlaskit = createAndFireEvent('atlaskit');

const createAndFireOnClick = (
  createAnalyticsEvent: CreateUIAnalyticsEventSignature,
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

export class DrawerBase extends Component<DrawerProps> {
  static defaultProps = {
    width: 'narrow',
  };

  body = canUseDOM ? document.querySelector('body') : undefined;

  componentDidMount() {
    const { isOpen } = this.props;

    if (isOpen) {
      window.addEventListener('keydown', this
        .handleKeyDown as EventListenerOrEventListenerObject);
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

  private handleBlanketClick = (event: SyntheticEvent) => {
    this.handleClose(event, 'blanket');
  };

  private handleBackButtonClick = (event: SyntheticEvent) => {
    this.handleClose(event, 'backButton');
  };

  private handleClose = (event: SyntheticEvent, trigger: CloseTrigger) => {
    const { createAnalyticsEvent, onClose } = this.props;

    if (createAnalyticsEvent) {
      const analyticsEvent = createAndFireOnClick(
        createAnalyticsEvent,
        trigger,
      );

      if (onClose) {
        onClose(event, analyticsEvent);
      }
    }
  };

  handleKeyDown = (event: KeyboardEvent) => {
    const { isOpen, onKeyDown } = this.props;

    if (event.key === 'Escape' && isOpen) {
      this.handleClose((event as unknown) as React.KeyboardEvent, 'escKey');
    }
    if (onKeyDown) {
      onKeyDown((event as unknown) as React.KeyboardEvent);
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
    } = this.props;
    return (
      <Portal zIndex="unset">
        <TransitionGroup component={OnlyChild}>
          <Fragment>
            {/* $FlowFixMe the `in` prop is internal */}
            <Fade in={isOpen}>
              <Blanket isTinted onBlanketClicked={this.handleBlanketClick} />
            </Fade>
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
          </Fragment>
        </TransitionGroup>
      </Portal>
    );
  }
}

export const DrawerItemTheme: FC = props => (
  <ThemeProvider theme={drawerItemTheme}>{props.children}</ThemeProvider>
);

export * from './skeletons';
export * from './item-group';

export default withAnalyticsContext({
  componentName: 'drawer',
  packageName,
  packageVersion,
})(withAnalyticsEvents()(DrawerBase));
