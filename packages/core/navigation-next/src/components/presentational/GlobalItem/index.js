// @flow

import React, { PureComponent, createRef } from 'react';

import { navigationItemClicked } from '../../../common/analytics';
import InteractionStateManager from '../InteractionStateManager';
import type { InteractionState } from '../InteractionStateManager/types';
import { styleReducerNoOp, withGlobalTheme } from '../../../theme';
import GlobalItemPrimitive from './primitives';
import type { GlobalItemProps } from './types';

export class GlobalItemBase extends PureComponent<GlobalItemProps> {
  static defaultProps = {
    label: '',
    size: 'large',
    styles: styleReducerNoOp,
  };

  componentDidMount() {
    this.publishRef();
  }

  componentDidUpdate() {
    this.publishRef();
  }

  node = createRef();

  publishRef() {
    const { getRef } = this.props;
    if (typeof getRef === 'function') {
      getRef(this.node);
    }
  }

  renderItem = (state: InteractionState) => {
    const { createAnalyticsEvent, theme, ...props } = this.props;
    return <GlobalItemPrimitive {...state} {...props} />;
  };

  render() {
    const {
      size,
      theme: { mode },
    } = this.props;
    const { itemWrapper: itemWrapperStyles } = styleReducerNoOp(
      mode.globalItem({ size }),
    );
    return (
      <div css={itemWrapperStyles} ref={this.node}>
        <InteractionStateManager>{this.renderItem}</InteractionStateManager>
      </div>
    );
  }
}

export default navigationItemClicked(
  withGlobalTheme(GlobalItemBase),
  'globalItem',
  true,
);

export type { GlobalItemProps };
