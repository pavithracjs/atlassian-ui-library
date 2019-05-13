// @flow

import React, { Component } from 'react';
import isEqual from 'lodash.isequal';

import type { InteractionState, InteractionStateProps } from './types';

export default class InteractionStateManager extends Component<
  InteractionStateProps,
  InteractionState,
> {
  state = {
    isActive: false,
    isHover: false,
    isFocused: false,
  };

  shouldComponentUpdate(
    nextProps: InteractionStateProps,
    nextState: InteractionState,
  ) {
    const shouldRender =
      !isEqual(this.state, nextState) || !isEqual(this.props, nextProps);
    return shouldRender;
  }

  onMouseDown = (e: SyntheticMouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    this.setState({ isActive: true });
  };

  onMouseUp = (e: SyntheticMouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    this.setState({ isActive: false, isHover: true });
  };

  onMouseEnter = () => {
    if (!this.state.isHover) {
      this.setState({ isHover: true });
    }
  };

  onMouseLeave = () => {
    this.setState({ isActive: false, isHover: false });
  };

  onFocus = () => this.setState({ isFocused: true });

  onBlur = () => this.setState({ isFocused: false });

  render() {
    return (
      <div
        onMouseDown={this.onMouseDown}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        onMouseUp={this.onMouseUp}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        role="presentation"
        css={{
          width: '100%',
          alignItems: 'center',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
        }}
      >
        {this.props.children(this.state)}
      </div>
    );
  }
}
