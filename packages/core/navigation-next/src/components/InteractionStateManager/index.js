// @flow

import React, { PureComponent } from 'react';

import type { InteractionState, InteractionStateProps } from './types';

export default class InteractionStateManager extends PureComponent<
  InteractionStateProps,
  InteractionState,
> {
  state = {
    isActive: false,
    isHover: false,
  };

  onMouseDown = (e: Event) => {
    e.preventDefault();
    this.setState({ isActive: true });
  };

  onMouseUp = () => this.setState({ isActive: false });

  onMouseEnter = () => this.setState({ isHover: true });

  onMouseLeave = () => this.setState({ isActive: false, isHover: false });

  render() {
    return (
      <div
        onMouseDown={this.onMouseDown}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onMouseUp={this.onMouseUp}
        role="presentation"
      >
        {this.props.children(this.state)}
      </div>
    );
  }
}
