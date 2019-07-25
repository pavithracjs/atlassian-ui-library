// @flow

import React, { Component } from 'react';
import ArrowLeftCircleIcon from '@atlaskit/icon/glyph/arrow-left-circle';
import { gridSize as gridSizeFn } from '@atlaskit/theme';

import ConnectedItem from '../ConnectedItem';
import type { BackItemProps } from './types';

const gridSize = gridSizeFn();

const ArrowLeft = () => (
  <ArrowLeftCircleIcon primaryColor="currentColor" secondaryColor="inherit" />
);

type State = {
  tabindex: number,
};
export default class BackItem extends Component<BackItemProps, State> {
  static defaultProps = {
    text: 'Back',
  };

  state = {
    tabindex: 0,
  };

  resetTabIndex = () => {
    this.setState({
      tabindex: -1,
    });
  };

  render() {
    const { before: beforeProp, text, ...props } = this.props;
    let before = beforeProp;
    if (!before) {
      before = ArrowLeft;
    }

    return (
      <div
        data-id="back-item"
        // This is added so that the correct element can
        // tabbed on page transition when navigating via keyboard.
        // eslint-disable-next-line
        tabIndex={this.state.tabindex}
        onFocus={this.resetTabIndex}
        css={{ marginBottom: gridSize * 2, outline: 'none' }}
      >
        <ConnectedItem {...props} after={null} before={before} text={text} />
      </div>
    );
  }
}
