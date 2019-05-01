import * as React from 'react';
import { Component, ReactNode } from 'react';
import { canUseDOM } from 'exenv';
import { createPortal } from 'react-dom';
import { Transition } from 'react-transition-group';

import { withHelp, HelpContextInterface } from '../HelpContext';
import { transitionDurationMs } from './constants';
import { HelpDrawer, HelpDrawerContent } from './styled';

import { gridSize } from '@atlaskit/theme/constants';

export const UNMOUNTED = 'unmounted';
export const EXITED = 'exited';
export const ENTERING = 'entering';
export const ENTERED = 'entered';
export const EXITING = 'exiting';

export type TransitionStatus =
  | typeof ENTERING
  | typeof ENTERED
  | typeof EXITING
  | typeof EXITED
  | typeof UNMOUNTED;

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
  entered: { width: `${60 * gridSize()}px`, flex: `0 0 ${60 * gridSize()}px` },
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

  renderDrawer = (Container: any) => {
    const { children, help } = this.props;

    return createPortal(
      <Transition in={help.isOpen} timeout={transitionDurationMs}>
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
    if (this.state.container) {
      const container = this.state.container
        ? this.state.container
        : document.createElement('div');

      return this.renderDrawer(container);
    } else {
      return null;
    }
  }
}

export default withHelp(HelpPanelDrawer);
