// @flow

import React, { Component, Fragment } from 'react';
import deepEqual from 'deep-equal';
import Transition from 'react-transition-group/Transition';
import { NavigationAnalyticsContext } from '@atlaskit/analytics-namespaced-context';

import { transitionDurationMs } from '../../../common/constants';
import { ContainerNavigation, ProductNavigation } from './primitives';
import type { ContentNavigationProps, ContentNavigationState } from './types';

export default class ContentNavigation extends Component<
  ContentNavigationProps,
  ContentNavigationState,
> {
  isMounted = false;

  state = {
    cachedContainer: null,
  };

  componentDidMount() {
    this.isMounted = true;
  }

  shouldComponentUpdate(nextProps: ContentNavigationProps) {
    const { props } = this;
    return !deepEqual(props, nextProps);
  }

  static getDerivedStateFromProps(
    { container }: ContentNavigationProps,
    state: ContentNavigationState,
  ) {
    if (container && container !== state.cachedContainer) {
      // We cache the most recent container component in state so that we can
      // render it while the container layer is transitioning out, which is
      // triggered by setting the container prop to null.
      return { ...state, cachedContainer: container };
    }
    return null;
  }

  render() {
    const { container, isVisible, product: Product } = this.props;
    const { cachedContainer: CachedContainer } = this.state;

    const shouldRenderContainer = Boolean(container);
    const ContainerComponent = CachedContainer || Fragment;

    return (
      <Fragment>
        <ProductNavigation>
          <NavigationAnalyticsContext
            data={{ attributes: { navigationLayer: 'product' } }}
          >
            <ToggleContent isVisible={isVisible}>
              <Product />
            </ToggleContent>
          </NavigationAnalyticsContext>
        </ProductNavigation>
        <Transition
          in={shouldRenderContainer}
          timeout={this.isMounted ? transitionDurationMs : 0}
          mountOnEnter
          unmountOnExit
        >
          {state => (
            <ContainerNavigation
              isEntering={state === 'entering'}
              isExiting={state === 'exiting'}
            >
              <NavigationAnalyticsContext
                data={{ attributes: { navigationLayer: 'container' } }}
              >
                <ToggleContent isVisible={isVisible && shouldRenderContainer}>
                  <ContainerComponent />
                </ToggleContent>
              </NavigationAnalyticsContext>
            </ContainerNavigation>
          )}
        </Transition>
      </Fragment>
    );
  }
}

const ToggleContent = ({ isVisible, ...rest }) => (
  <div css={{ display: isVisible ? 'block' : 'none' }} {...rest} />
);
