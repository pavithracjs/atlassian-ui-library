import React from 'react';
import { Component, ReactNode } from 'react';
import { canUseDOM } from 'exenv';
import { createPortal } from 'react-dom';
import { Transition } from 'react-transition-group';

import { transitionDurationMs, panelWidth } from './constants';
import { RightSidePanelDrawer, RightSidePanelDrawerContent } from './styled';

export const UNMOUNTED = 'unmounted';
export const EXITED = 'exited';
export const ENTERING = 'entering';
export const ENTERED = 'entered';
export const EXITING = 'exiting';

export enum TransitionStatus {
  UNMOUNTED = 'unmounted',
  EXITED = 'exited',
  ENTERING = 'entering',
  ENTERED = 'entered',
  EXITING = 'exiting',
}

export interface Props {
  // Open/Closed state
  isOpen: boolean;
  // ID for the HTML tag where we want to attach the RightSidePanel
  attachPanelTo: string;
  // Right Hand Side panel content
  children?: ReactNode;
}

export interface State {
  entered: boolean;
  container?: Element | null; // Element in where the RightSidePanel will be attached
}

const defaultStyle = {
  transition: `width ${transitionDurationMs}ms,
  flex ${transitionDurationMs}ms`,
  width: `0`,
  flex: `0 0 0`,
};

const transitionStyles: { [id: string]: React.CSSProperties } = {
  entered: { width: `${panelWidth}px`, flex: `0 0 ${panelWidth}px` },
  exited: { width: 0, flex: `0 0 0` },
};

export class RightSidePanel extends Component<Props, State> {
  attachPanelTo = this.props.attachPanelTo;

  state = {
    entered: false,
    container: undefined,
  };

  componentDidMount() {
    this.setState({
      container: canUseDOM
        ? document.querySelector('#' + this.attachPanelTo)
        : undefined,
    });
  }

  renderDrawer = (Container: HTMLElement) => {
    const { children, isOpen } = this.props;

    return createPortal(
      <Transition
        in={isOpen}
        timeout={transitionDurationMs}
        mountOnEnter
        unmountOnExit
        appear
      >
        {(state: TransitionStatus) => (
          <RightSidePanelDrawer
            style={{
              ...defaultStyle,
              ...transitionStyles[state],
            }}
          >
            <RightSidePanelDrawerContent>
              {children}
            </RightSidePanelDrawerContent>
          </RightSidePanelDrawer>
        )}
      </Transition>,
      Container,
    );
  };

  render() {
    const { container } = this.state;

    return !!container ? this.renderDrawer(container!) : null;
  }
}

export default RightSidePanel;
