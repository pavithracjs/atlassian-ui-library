import * as React from 'react';
import { PureComponent, ReactNode } from 'react';
import { canUseDOM } from 'exenv';
import { createPortal } from 'react-dom';
import { Transition } from 'react-transition-group';

import { withHelp, HelpContextInterface } from '../HelpContext';
import { transitionDurationMs, transitionTimingFunction } from './constants';
import { HelpDrawer, HelpDrawerContent } from './styled';

export interface Props {
  children?: ReactNode;
}
export interface State {
  entered: boolean;
}

const defaultStyle = {
  transition:
    `transform ${transitionDurationMs}ms ${transitionTimingFunction}, ` +
    `width ${transitionDurationMs}ms ${transitionTimingFunction}`,
  transform: 'translate3d(calc(100% + 60px),0,0)',
};

const transitionStyles = {
  entered: { transform: null },
  exited: { transform: 'translate3d(calc(100% + 60px),0,0)' },
};

export class GlobalHelpDrawer extends PureComponent<
  Props & HelpContextInterface,
  State
> {
  body = canUseDOM ? document.querySelector('body') : undefined;

  state = {
    entered: false,
  };

  render() {
    const { children, help } = this.props;
    console.log(help);

    if (this.body) {
      return createPortal(
        <Transition in={help.isOpen} timeout={220} unmountOnExit>
          {state => (
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
        this.body,
      );
    } else {
      return null;
    }
  }
}

export default withHelp(GlobalHelpDrawer);
