import * as React from 'react';
import { Component, SyntheticEvent, ReactNode } from 'react';
import { InactivityDetectorWrapper } from './styled';
import { findParentByClassname, hideControlsClassName } from '..';

export interface ContentProps {
  children: ReactNode;
  showControlsRegister?: (showControls: () => void) => void;
}

export interface ContentState {
  showControls: boolean;
}

const mouseMovementDelay = 2000;

export class InactivityDetector extends Component<ContentProps, ContentState> {
  private checkActivityTimeout?: number;
  private contentWrapperElement?: HTMLElement;

  state: ContentState = {
    showControls: true,
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
        this.contentWrapperElement,
      );
      if (!isOverHideableElement) {
        this.setState({ showControls: false });
      }
    } else {
      this.setState({ showControls: false });
    }
  };

  private checkMouseMovement = (e?: SyntheticEvent<HTMLElement>) => {
    const { showControls } = this.state;
    this.clearTimeout();
    // This check is needed to not trigger a render call on every movement.
    // Even if nothing will be re-renderer since the value is the same, it
    // will go into any children render method for nothing.
    if (!showControls) {
      this.setState({ showControls: true });
    }
    this.checkActivityTimeout = window.setTimeout(
      this.hideControls(e && (e.target as HTMLElement)),
      mouseMovementDelay,
    );
  };

  componentDidMount() {
    const { showControlsRegister } = this.props;
    if (showControlsRegister) {
      showControlsRegister(this.checkMouseMovement);
    }
    this.checkMouseMovement();
  }

  componentWillUnmount() {
    this.clearTimeout();
  }

  private saveContentWrapperRef = (el: HTMLElement) => {
    this.contentWrapperElement = el;
  };

  render() {
    const { showControls } = this.state;
    const { children } = this.props;

    return (
      <InactivityDetectorWrapper
        innerRef={this.saveContentWrapperRef}
        showControls={showControls}
        onMouseMove={this.checkMouseMovement}
        onClick={this.checkMouseMovement}
      >
        {children}
      </InactivityDetectorWrapper>
    );
  }
}
