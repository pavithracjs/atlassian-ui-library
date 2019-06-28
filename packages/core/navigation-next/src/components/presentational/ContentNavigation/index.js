// @flow

import React, { Component, Fragment } from 'react';
import deepEqual from 'deep-equal';
import Transition from 'react-transition-group/Transition';
import { NavigationAnalyticsContext } from '@atlaskit/analytics-namespaced-context';

import { transitionDurationMs } from '../../../common/constants';
import { ContainerNavigation, ProductNavigation } from './primitives';
import type { ContentNavigationProps, ContentNavigationState } from './types';

const HideableDiv = ({ isVisible, ...rest }: { isVisible: boolean }) => (
  <div css={{ display: isVisible ? 'block' : 'none' }} {...rest} />
);

const ToggleContent = ({
  isVisible,
  experimental_hideNavVisuallyOnCollapse: EXPERIMENTAL_HIDE_NAV_VISUALLY_ON_COLLAPSE,
  ...rest
}: {
  isVisible: boolean,
  experimental_hideNavVisuallyOnCollapse: boolean,
}) => {
  // If FF is false, retain the old behaviour of
  // un-mounting navigation components on collapse
  if (!EXPERIMENTAL_HIDE_NAV_VISUALLY_ON_COLLAPSE && !isVisible) {
    return null;
  }

  return <HideableDiv {...rest} isVisible />;
};

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
    const {
      container,
      isVisible,
      product: Product,
      experimental_hideNavVisuallyOnCollapse: EXPERIMENTAL_HIDE_NAV_VISUALLY_ON_COLLAPSE,
    } = this.props;
    const { cachedContainer: CachedContainer } = this.state;

    const shouldRenderContainer = Boolean(container);
    const ContainerComponent = CachedContainer || Fragment;

    return (
      <Fragment>
        <ProductNavigation>
          <ToggleContent
            experimental_hideNavVisuallyOnCollapse={
              EXPERIMENTAL_HIDE_NAV_VISUALLY_ON_COLLAPSE
            }
            isVisible={isVisible}
          >
            <NavigationAnalyticsContext
              data={{ attributes: { navigationLayer: 'product' } }}
            >
              <Product />
            </NavigationAnalyticsContext>
          </ToggleContent>
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
              <ToggleContent
                experimental_hideNavVisuallyOnCollapse={
                  EXPERIMENTAL_HIDE_NAV_VISUALLY_ON_COLLAPSE
                }
                isVisible={isVisible}
              >
                <NavigationAnalyticsContext
                  data={{ attributes: { navigationLayer: 'container' } }}
                >
                  <ContainerComponent />
                </NavigationAnalyticsContext>
              </ToggleContent>
            </ContainerNavigation>
          )}
        </Transition>
      </Fragment>
    );
  }
}
