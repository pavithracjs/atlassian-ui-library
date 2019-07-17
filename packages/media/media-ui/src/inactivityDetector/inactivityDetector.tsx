import * as React from 'react';
import { Component, SyntheticEvent, ReactElement } from 'react';
import { InactivityDetectorWrapper } from './styled';
import { findParentByClassname, hideControlsClassName } from '..';

export interface InactivityDetectorProps {
  children: (triggerActivityCallback: () => void) => ReactElement;
  // // Consumer will give us a callback requester, that we call with an argument
  // // being a reference to a function (triggerActivityCallback) we want consumer to call
  // // when they want to trigger an custom activity outside what this wrapper supports (mouse movement)
  // triggerActivityCallbackRequester?: (
  //   ,
  // ) => void;
}

export interface InactivityDetectorState {
  controlsAreVisible: boolean;
}

const mouseMovementDelay = 2000;

/**
 * Hides all the child elements with `hideControlsClassName` classname when user is inactive,
 * which means he hasn't moved mouse over the component for `mouseMovementDelay` ms.
 * Exception is if user holding mouse over one of the hideable elements (those that have specified classname).
 *
 */
export class InactivityDetector extends Component<
  InactivityDetectorProps,
  InactivityDetectorState
> {
  private checkActivityTimeout?: number;
  private readonly contentWrapperElement: React.RefObject<
    HTMLElement
  > = React.createRef();

  state: InactivityDetectorState = {
    controlsAreVisible: true,
  };

  private clearTimeout = () => {
    if (this.checkActivityTimeout) {
      window.clearTimeout(this.checkActivityTimeout);
    }
  };

  private hideControls = (element?: HTMLElement) => () => {
    if (element) {
      const isOverHideableElement = findParentByClassname(
        element,
        hideControlsClassName,
        this.contentWrapperElement.current || undefined,
      );
      if (!isOverHideableElement) {
        this.setState({ controlsAreVisible: false });
      }
    } else {
      this.setState({ controlsAreVisible: false });
    }
  };

  private checkMouseMovement = (e?: SyntheticEvent<HTMLElement>) => {
    const { controlsAreVisible } = this.state;
    this.clearTimeout();
    // This check is needed to not trigger a render call on every movement.
    // Even if nothing will be re-renderer since the value is the same, it
    // will go into any children render method for nothing.
    if (!controlsAreVisible) {
      this.setState({ controlsAreVisible: true });
    }
    this.checkActivityTimeout = window.setTimeout(
      this.hideControls(e && (e.target as HTMLElement)),
      mouseMovementDelay,
    );
  };

  componentDidMount() {
    this.checkMouseMovement();
  }

  componentWillUnmount() {
    this.clearTimeout();
  }

  render() {
    const { controlsAreVisible } = this.state;
    const { children } = this.props;

    return (
      <InactivityDetectorWrapper
        innerRef={this.contentWrapperElement}
        controlsAreVisible={controlsAreVisible}
        onMouseMove={this.checkMouseMovement}
        onClick={this.checkMouseMovement}
      >
        {children(this.checkMouseMovement)}
      </InactivityDetectorWrapper>
    );
  }
}
