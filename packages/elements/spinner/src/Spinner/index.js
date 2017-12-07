// @flow

import React, { Component } from 'react';
import { Transition } from 'react-transition-group';
import styled from 'styled-components';

import Container from './styledContainer';
import Svg from './styledSvg';
import type { SpinnerProps, SpinnerState } from '../types';

const Outer = styled.div`
  display: inline-block;
`;
Outer.displayName = 'Outer';

const SIZES_MAP = {
  small: 20,
  medium: 30,
  large: 50,
  xlarge: 100,
};
const DEFAULT_SIZE = SIZES_MAP.small;

export default class Spinner extends Component<SpinnerProps, SpinnerState> {
  static defaultProps = {
    delay: 100,
    isCompleting: false,
    invertColor: false,
    onComplete: () => {},
    size: 'small',
  };

  transitionNode: ?HTMLElement;

  constructor(props: SpinnerProps) {
    super(props);
    this.state = {
      phase: '',
    };
  }

  enter = () => {
    const { delay } = this.props;
    if (delay) {
      this.setState({ phase: 'DELAY' });
    } else {
      this.setState({ phase: 'ENTER' });
    }
  };

  idle = () => {
    this.setState({ phase: 'IDLE' });
  };

  exit = () => {
    this.setState({ phase: 'LEAVE' });
  };

  endListener = (node: ?HTMLElement, done: Function) => {
    const executeCallback = (event: AnimationEvent) => {
      // ignore animation events on the glyph
      if (event.target.tagName === 'svg') {
        return false;
      }
      if (this.state.phase === 'DELAY') {
        this.setState({ phase: 'ENTER' });
        this.endListener(node, done);
      } else {
        done();
      }
      return node && node.removeEventListener('animationend', executeCallback);
    };
    return node && node.addEventListener('animationend', executeCallback);
  };

  validateSize = () => {
    const { size } = this.props;
    const spinnerSize = SIZES_MAP[size] || size;
    return typeof spinnerSize === 'number' ? spinnerSize : DEFAULT_SIZE;
  };

  render() {
    const { phase } = this.state;
    const { delay, invertColor, isCompleting } = this.props;
    const size = this.validateSize();

    const strokeWidth = Math.round(size / 10);
    const strokeRadius = size / 2 - strokeWidth / 2;
    return (
      <Outer>
        <Transition
          addEndListener={this.endListener}
          appear
          in={!isCompleting}
          mountOnEnter
          unmountOnExit
          onEnter={this.enter}
          onEntered={this.idle}
          onExit={this.exit}
          onExited={() => this.props.onComplete()}
          ref={node => {
            this.transitionNode = node;
          }}
        >
          <Container delay={delay / 1000} phase={phase} size={size}>
            <Svg
              focusable="false"
              height={size}
              invertColor={invertColor}
              phase={phase}
              size={size}
              viewBox={`0 0 ${size} ${size}`}
              width={size}
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx={size / 2} cy={size / 2} r={strokeRadius} />
            </Svg>
          </Container>
        </Transition>
      </Outer>
    );
  }
}
