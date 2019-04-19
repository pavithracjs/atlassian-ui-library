import * as React from 'react';
import { Component, ReactNode } from 'react';
import { canUseDOM } from 'exenv';
import { createPortal } from 'react-dom';
import { Transition } from 'react-transition-group';

import { withHelp, HelpContextInterface } from '../HelpContext';
import { transitionDurationMs } from './constants';
import { HelpDrawer, HelpDrawerContent } from './styled';

import { gridSize } from '@atlaskit/theme';

export interface Props {
  children?: ReactNode;
}
export interface State {
  entered: boolean;
}

const defaultStyle = {
  transition: `width ${transitionDurationMs}ms, 
  flex ${transitionDurationMs}ms`,
  width: `0`,
  flex: `0 0 0`,
};

const transitionStyles = {
  entered: { width: `${60 * gridSize()}px`, flex: `0 0 ${60 * gridSize()}px` },
  exited: { width: 0, flex: `0 0 0` },
};

export class HelpPanelDrawer extends Component<
  Props & HelpContextInterface,
  State
> {
  body = canUseDOM ? document.querySelector('#app') : undefined;

  state = {
    entered: false,
  };

  render() {
    const { children, help } = this.props;

    const transitionStyle =
      transitionStyles[this.state.entered ? 'entered' : 'exited'];

    if (this.body) {
      return createPortal(
        <Transition in={help.isOpen} timeout={220}>
          {(state: State) => (
            <HelpDrawer
              style={{
                ...defaultStyle,
                ...transitionStyle,
              }}
            >
              <HelpDrawerContent>{children}</HelpDrawerContent>
            </HelpDrawer>
          )}
        </Transition>,
        this.body,
      );
    } else {
      return null;
    }
  }
}

export default withHelp(HelpPanelDrawer);
