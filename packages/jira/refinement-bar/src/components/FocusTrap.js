// @flow

import React, { type ElementRef, type Node } from 'react';
import { createPortal } from 'react-dom';
import tabbable from 'tabbable';

type Props = {
  children: ({ ref: ElementRef<*> }) => Node,
};

export default class FocusTrap extends React.Component<Props> {
  constructor(props: Props) {
    super(props);

    if (typeof document !== 'undefined') {
      this.originElement = document.activeElement;
    }
  }

  target: ElementRef<*> = React.createRef();

  originElement: HTMLElement | null;

  focus = () => {
    const target = this.target.current;
    const el = tabbable(target)[0] || target;

    if (el && typeof el.focus === 'function') {
      el.focus({ preventScroll: true });
    }
  };

  handleFocus = (event: FocusEvent) => {
    const el = this.target.current;

    if (el && el !== event.target && !el.contains(event.target)) {
      this.focus();
    }
  };

  componentDidMount() {
    this.focus();

    document.addEventListener('focusin', this.handleFocus);
  }

  componentWillUnmount() {
    document.removeEventListener('focusin', this.handleFocus);

    const el = this.originElement;

    if (el && typeof el.focus === 'function') {
      el.focus();
    }
  }

  // NOTE: wait for the target to be available before injecting the tab
  // catcher so, if the target is also portalled, the tab catcher will be
  // *after* the target in the DOM.
  renderTabCatcher = () => {
    return this.target.current
      ? createPortal(
          <div tabIndex="0" data-last-tabbable-node />, // eslint-disable-line
          ((document.body: any): HTMLElement),
        )
      : null;
  };

  render() {
    return (
      <>
        {this.props.children({ ref: this.target })}
        {this.renderTabCatcher()}
      </>
    );
  }
}
