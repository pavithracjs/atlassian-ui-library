// @flow
/** @jsx jsx */

import React, {
  PureComponent,
  // $FlowFixMe
  forwardRef,
  type ElementRef,
  type Element as ElementType,
  type Node,
} from 'react';
import { createPortal } from 'react-dom';
import { applyRefs } from 'apply-ref';
import {
  Manager,
  Reference,
  Popper,
  type PopperProps,
  type PopperChildrenProps,
} from 'react-popper';
import { colors, gridSize, layers } from '@atlaskit/theme';
import { jsx } from '@emotion/core';

import { isEmptyObj } from '../utils';
import FocusTrap from './FocusTrap';

// ==============================
// Types
// ==============================

type PopperChildren = { children: PopperChildrenProps => Node };
type PopperPropsNoChildren = $Diff<PopperProps, PopperChildren>;
type Props = {
  allowClose: boolean,
  children?: Node | (({ scheduleUpdate: * }) => Node),
  innerRef?: ElementRef<*>,
  isOpen?: boolean,
  popperProps?: PopperPropsNoChildren,
  onClose?: (*) => void,
  onOpen?: (*) => void,
  target: ({
    ref: ElementRef<*>,
    isOpen: boolean,
    onClick: (*) => void,
  }) => ElementType<*>,
};
type State = {
  isOpen: boolean,
  popperProps: PopperPropsNoChildren,
};

const defaultPopperProps = {
  modifiers: { offset: { offset: `0, 8` } },
  placement: 'bottom-start',
};

// ==============================
// Class
// ==============================

export default class Popup extends PureComponent<Props, State> {
  focusTrap: Object;

  dialogRef: ElementRef<*> = React.createRef();

  blanketRef: ElementRef<*> = React.createRef();

  openEvent: Event;

  state = {
    isOpen: this.props.isOpen !== undefined ? this.props.isOpen : false,
    popperProps: defaultPopperProps,
  };

  static getDerivedStateFromProps(p: Props, s: State) {
    const stateSlice = {};
    if (p.popperProps !== s.popperProps) {
      stateSlice.popperProps = { ...defaultPopperProps, ...p.popperProps };
    }
    if (!isEmptyObj(stateSlice)) {
      return stateSlice;
    }
    return null;
  }

  static defaultProps = {
    allowClose: true,
    popperProps: defaultPopperProps,
  };

  componentDidUpdate(prevProps: Props, prevState: State) {
    const wasOpen = this.getProp('isOpen', prevProps, prevState);
    const isOpen = this.getProp('isOpen');

    const closeWasAllowed = this.getProp('allowClose', prevProps, prevState);
    const closeIsAllowed = this.getProp('allowClose');

    // NOTE: event listeners bound on update, rather than within the open/close
    // methods because the consumer can take control of the open state.
    if ((!wasOpen && isOpen) || (!closeWasAllowed && closeIsAllowed)) {
      window.addEventListener('keydown', this.handleKeyDown);
    }
    if ((wasOpen && !isOpen) || (closeWasAllowed && !closeIsAllowed)) {
      window.removeEventListener('keydown', this.handleKeyDown);
    }
  }

  getProp = (
    key: string,
    props: Props = this.props,
    state: State = this.state,
  ) => {
    return props[key] !== undefined ? props[key] : state[key];
  };

  callProp = (name: string, ...args: Array<any>): any => {
    if (typeof this.props[name] === 'function') {
      return this.props[name](...args);
    }
    return null;
  };

  handleKeyDown = (event: KeyboardEvent) => {
    if (isEscapeEvent(event)) {
      this.close(event);
    }
  };

  open = (event: Event) => {
    this.callProp('onOpen', event);
    this.setState({ isOpen: true });
  };

  close = (event: Event) => {
    // the consumer needs this dialog to remain open, likely until an invalid
    // state is resolved
    if (!this.props.allowClose) return;

    this.callProp('onClose', event);
    this.setState({ isOpen: false });
  };

  renderDialog() {
    const { children } = this.props;
    const { popperProps } = this.state;
    const isOpen = this.getProp('isOpen');

    if (!isOpen) return null;

    const popperInstance = (
      <Popper {...popperProps}>
        {({ placement, ref: popperRef, style, scheduleUpdate }) => (
          <FocusTrap>
            {({ ref: focusRef }) => (
              <Dialog
                ref={applyRefs(popperRef, focusRef)}
                style={style}
                data-placement={placement}
              >
                {typeof children === 'function'
                  ? children({ scheduleUpdate })
                  : children}
              </Dialog>
            )}
          </FocusTrap>
        )}
      </Popper>
    );

    return popperProps.positionFixed
      ? popperInstance
      : createPortal(popperInstance, ((document.body: any): HTMLElement));
  }

  render() {
    const { allowClose, innerRef, target } = this.props;
    const isOpen = this.getProp('isOpen');
    const onClick = isOpen ? this.close : this.open;

    return (
      <Manager>
        <Reference innerRef={innerRef}>
          {({ ref }) => target({ ref, isOpen, onClick })}
        </Reference>
        {this.renderDialog()}
        {isOpen && <Blanket onClick={this.close} allowClose={allowClose} />}
      </Manager>
    );
  }
}

function isEscapeEvent(e) {
  return e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27;
}

// ==============================
// Styled Components
// ==============================

// eslint-disable-next-line react/no-multi-comp
export const Blanket = forwardRef(({ allowClose, ...props }: *, ref) => (
  <div
    ref={ref}
    css={{
      bottom: 0,
      cursor: !allowClose ? 'not-allowed' : null,
      left: 0,
      position: 'fixed',
      right: 0,
      top: 0,
      transform: 'translateZ(0)',
      zIndex: layers.layer(),
    }}
    {...props}
  />
));
// eslint-disable-next-line react/no-multi-comp
export const Dialog = forwardRef((props: *, ref) => {
  const shadow = colors.N40A;
  return (
    <div
      ref={ref}
      css={{
        backgroundColor: 'white',
        borderRadius: 4,
        boxShadow: `0 0 0 1px ${shadow}, 0 4px 11px ${shadow}`,
        zIndex: layers.layer(),
      }}
      {...props}
    />
  );
});
// eslint-disable-next-line react/no-multi-comp
export const DialogInner = forwardRef(
  ({ isPadded, maxWidth, minWidth, ...props }: *, ref) => (
    <div
      ref={ref}
      css={{
        maxWidth,
        minWidth,
        padding: isPadded ? gridSize() * 1.5 : null,
      }}
      {...props}
    />
  ),
);
DialogInner.defaultProps = {
  isPadded: false,
  maxWidth: 440,
  minWidth: 160,
};
