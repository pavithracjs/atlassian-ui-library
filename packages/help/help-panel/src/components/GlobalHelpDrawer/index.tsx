import * as React from 'react';
import { PureComponent, ReactNode } from 'react';
import { canUseDOM } from 'exenv';
import { createPortal } from 'react-dom';
import { Transition } from 'react-transition-group';
import { transitionDurationMs, transitionTimingFunction } from './constants';
import { HelpDrawer, HelpDrawerContent } from './styled';

const OnlyChild = ({ children }) => children.toArray(children)[0] || null;

export interface Props {
  isOpen?: boolean;
  children?: ReactNode;
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

export default class GlobalHelpDrawer extends PureComponent<Props> {
  body = canUseDOM ? document.querySelector('body') : undefined;

  constructor(props: Props) {
    super(props);

    this.state = {
      entered: false,
    };
  }

  render() {
    const { isOpen, children } = this.props;

    return createPortal(
      <Transition in={isOpen} timeout={220} unmountOnExit>
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
  }
}
