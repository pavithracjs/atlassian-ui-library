// @flow
import React, {
  Component,
  PureComponent,
  Fragment,
  type ComponentType,
} from 'react';
import deepEqual from 'deep-equal';
import { colors } from '@atlaskit/theme';

import { ContentNavigationWrapper } from '../ContentNavigation/primitives';
import ContentNavigation from '../ContentNavigation';
import { isTransitioning, type TransitionState } from '../ResizeTransition';
import { Shadow } from '../../../common/primitives';
import { light, ThemeProvider } from '../../../theme';
import {
  CONTENT_NAV_WIDTH_COLLAPSED,
  GLOBAL_NAV_WIDTH,
} from '../../../common/constants';

type ComposedContainerNavigationProps = {
  containerNavigation: ?ComponentType<{}>,
  datasets?: Object,
  experimental_flyoutOnHover: boolean,
  productNavigation: ComponentType<{}>,
  transitionState: TransitionState,
  transitionStyle: Object,
  isCollapsed: boolean,
  isResizing: boolean,
  getNavRef: () => void,
  expand: () => void,
  view?: Object | null,
};
export class ComposedContainerNavigation extends Component<ComposedContainerNavigationProps> {
  shouldComponentUpdate(nextProps: ComposedContainerNavigationProps) {
    const { props } = this;
    return !deepEqual(props, nextProps);
  }

  render() {
    const {
      containerNavigation,
      datasets,
      // eslint-disable-next-line camelcase
      experimental_flyoutOnHover: EXPERIMENTAL_FLYOUT_ON_HOVER,
      productNavigation,
      transitionState,
      transitionStyle,
      isCollapsed,
      isResizing,
      getNavRef,
      expand,
      view,
    } = this.props;

    const isVisible = transitionState !== 'exited';
    const shouldDisableInteraction =
      isResizing || isTransitioning(transitionState);

    const dataset = datasets ? datasets.contextualNavigation : {};

    return (
      <ContentNavigationWrapper
        key="product-nav-wrapper"
        innerRef={getNavRef}
        disableInteraction={shouldDisableInteraction}
        style={transitionStyle}
        {...dataset}
      >
        <ContentNavigation
          container={containerNavigation}
          isVisible={isVisible}
          key="product-nav"
          product={productNavigation}
          view={view}
        />
        {isCollapsed && !EXPERIMENTAL_FLYOUT_ON_HOVER ? (
          /* eslint-disable jsx-a11y/click-events-have-key-events */
          <div
            aria-label="Click to expand the navigation"
            role="button"
            onClick={expand}
            css={{
              cursor: 'pointer',
              height: '100%',
              outline: 0,
              position: 'absolute',
              transition: 'background-color 100ms',
              width: CONTENT_NAV_WIDTH_COLLAPSED,

              ':hover': {
                backgroundColor: containerNavigation
                  ? colors.N30
                  : 'rgba(255, 255, 255, 0.08)',
              },
              ':active': {
                backgroundColor: colors.N40A,
              },
            }}
            tabIndex="0"
          />
        ) : /* eslint-enable */
        null}
      </ContentNavigationWrapper>
    );
  }
}

type ComposedGlobalNavigationProps = {
  containerNavigation: ?ComponentType<{}>,
  datasets?: Object,
  globalNavigation: ComponentType<{}>,
  topOffset?: number,
  experimental_alternateFlyoutBehaviour: boolean,
  closeFlyout: () => void,
  view?: Object | null,
};

// Shallow comparision of props is sufficeint in this case
export class ComposedGlobalNavigation extends PureComponent<ComposedGlobalNavigationProps> {
  render() {
    const {
      containerNavigation,
      datasets,
      globalNavigation: GlobalNavigation,
      topOffset,
      // eslint-disable-next-line camelcase
      experimental_alternateFlyoutBehaviour: EXPERIMENTAL_ALTERNATE_FLYOUT_BEHAVIOUR,
      closeFlyout,
    } = this.props;

    const dataset = datasets ? datasets.globalNavigation : {};

    return (
      <div
        {...dataset}
        onMouseOver={
          EXPERIMENTAL_ALTERNATE_FLYOUT_BEHAVIOUR ? closeFlyout : null
        }
      >
        <ThemeProvider
          theme={theme => ({
            topOffset,
            mode: light, // If no theme already exists default to light mode
            ...theme,
          })}
        >
          <Fragment>
            <Shadow
              isBold={!!containerNavigation}
              isOverDarkBg
              style={{ marginLeft: GLOBAL_NAV_WIDTH }}
            />
            <GlobalNavigation />
          </Fragment>
        </ThemeProvider>
      </div>
    );
  }
}
