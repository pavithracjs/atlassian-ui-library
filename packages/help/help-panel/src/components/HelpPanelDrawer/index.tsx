import * as React from 'react';
import { Component, ReactNode } from 'react';
import { canUseDOM } from 'exenv';
import { createPortal } from 'react-dom';
import { Transition } from 'react-transition-group';

import { withHelp, HelpContextInterface } from '../HelpContext';
import { transitionDurationMs, panelWidth } from './constants';
import { HelpDrawer, HelpDrawerContent } from './styled';

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
  attachPanelTo: string;
  children?: ReactNode;
}
export interface State {
  entered: boolean;
  container?: Element | null; // Element in where the HelpPanelDrawer will be attached
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

export class HelpPanelDrawer extends Component<
  Props & HelpContextInterface,
  State
> {
  attachPanelTo = this.props.attachPanelTo ? this.props.attachPanelTo : 'app';

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
    const { children, help } = this.props;

    return createPortal(
      <Transition
        in={help.isOpen}
        timeout={transitionDurationMs}
        mountOnEnter
        unmountOnExit
        appear
      >
        {(state: TransitionStatus) => (
          <HelpDrawer
            style={{
              ...defaultStyle,
              ...transitionStyles[state],
            }}
          >
            <HelpDrawerContent>{children}</HelpDrawerContent>
          </HelpDrawer>
        )}
      </Transition>,
      Container,
    );
  };

  render() {
    const { container } = this.state;

    return !!container ? this.renderDrawer(container) : null;
  }
}

export default withHelp(HelpPanelDrawer);
