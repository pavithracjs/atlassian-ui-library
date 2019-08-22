// @flow

import React, { Fragment, type Node } from 'react';
import { css, keyframes } from '@emotion/core';
import { N70A } from '@atlaskit/theme/colors';

import {
  transitionDuration,
  transitionTimingFunction,
} from '../../../common/constants';
import {
  light,
  withContentTheme,
  ThemeProvider,
  type ProductTheme,
} from '../../../theme';
import type { Resizable } from '../LayoutManager/primitives';
import { applyDisabledProperties } from '../../../common/helpers';

import type {
  ContainerNavigationPrimitiveBaseProps,
  ContainerNavigationPrimitiveProps,
} from './types';

/**
 * Component tree structure
 *  - ProductNavigation
 *  - ContainerNavigation
 *    - ContainerOverlay
 */

export const ScrollProviderRef = React.createContext();
const ScrollProvider = ({ isVisible, ...props }: any) => {
  const scrollProviderRef = React.createRef();

  return (
    <ScrollProviderRef.Provider value={scrollProviderRef}>
      <div
        css={{
          boxSizing: 'border-box',
          display: isVisible ? 'flex' : 'none',
          flexDirection: 'column',
          height: '100%',
          overflowX: 'hidden',
          overflowY: 'auto',
          width: '100%',
        }}
        tabIndex={-1}
        role="group"
        ref={scrollProviderRef}
        {...props}
      />
    </ScrollProviderRef.Provider>
  );
};

/**
 * ProductNavigation
 */
type ProductNavigationPrimitiveBaseProps = {
  children: Node,
  theme: ProductTheme,
  isVisible: boolean,
};

const ProductNavigationPrimitiveBase = ({
  children,
  isVisible,
  theme = { mode: light, context: 'product' },
}: ProductNavigationPrimitiveBaseProps) => (
  <div
    css={{
      ...theme.mode.contentNav().product,
      '&:not(:only-child)': {
        // Setting z-index ensures ScrollHints stay below the container nav
        // &:not(:only-child) sets it only when both container and product
        // nav are rendered.
        zIndex: -1,
      },
    }}
  >
    <ScrollProvider isVisible={isVisible}>{children}</ScrollProvider>
  </div>
);

const ProductNavigationPrimitive = withContentTheme(
  ProductNavigationPrimitiveBase,
);

type ProductNavigationProps = { isVisible: boolean, children: Node };

type BaseNavigationTheme = {
  children: Node,
};

export const ProductNavigationTheme = ({ children }: BaseNavigationTheme) => (
  <ThemeProvider
    theme={oldTheme => ({ mode: light, ...oldTheme, context: 'product' })}
  >
    <Fragment>{children}</Fragment>
  </ThemeProvider>
);

export const ProductNavigation = (props: ProductNavigationProps) => (
  <ProductNavigationTheme>
    <ProductNavigationPrimitive {...props} />
  </ProductNavigationTheme>
);

const slideIn = keyframes`
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
`;

/**
 * ContainerNavigation
 */
const ContainerNavigationPrimitiveBase = ({
  children,
  isEntering,
  isExiting,
  theme,
  isVisible,
}: ContainerNavigationPrimitiveBaseProps) => {
  let animationName;
  if (isEntering) animationName = slideIn;

  const transform = isExiting ? 'translateX(100%)' : null;

  return (
    <div
      css={css`
      ${{
        ...theme.mode.contentNav().container,
        animationDuration: transitionDuration,
        animationFillMode: 'forwards',
        animationTimingFunction: transitionTimingFunction,
        transitionProperty: 'boxShadow, transform',
        transitionDuration,
        transitionTimingFunction,
        transform,
      }}
      animation-name: ${animationName};
      `}
    >
      <ScrollProvider isVisible={isVisible}>{children}</ScrollProvider>
    </div>
  );
};

const ContainerNavigationPrimitive = withContentTheme(
  ContainerNavigationPrimitiveBase,
);

export const ContainerNavigationTheme = ({ children }: BaseNavigationTheme) => (
  <ThemeProvider theme={{ mode: light, context: 'container' }}>
    <Fragment>{children}</Fragment>
  </ThemeProvider>
);

export const ContainerNavigation = (
  props: ContainerNavigationPrimitiveProps,
) => (
  <ContainerNavigationTheme>
    <ContainerNavigationPrimitive {...props} />
  </ContainerNavigationTheme>
);

/**
 * ContainerOverlay
 */
type ContainerOverlayProps = { isVisible: boolean, onClick?: Event => void };

export const ContainerOverlay = ({
  isVisible,
  onClick,
  ...props
}: ContainerOverlayProps) => (
  <div
    css={{
      backgroundColor: N70A,
      cursor: isVisible ? 'pointer' : 'default',
      height: '100%',
      left: 0,
      opacity: isVisible ? 1 : 0,
      pointerEvents: isVisible ? 'all' : 'none',
      position: 'absolute',
      top: 0,
      transitionDuration,
      transitionProperty: 'opacity',
      transitionTimingFunction,
      width: '100%',
      zIndex: 5,
    }}
    onClick={onClick}
    role="presentation"
    {...props}
  />
);

export const ContentNavigationWrapper = ({
  innerRef,
  disableInteraction,
  ...props
}: Resizable) => (
  <div
    ref={innerRef}
    css={{
      height: '100%',
      position: 'relative',
      ...applyDisabledProperties(!!disableInteraction),
    }}
    {...props}
  />
);

export const ContainerNavigationMask = ({
  disableInteraction,
  ...props
}: {
  disableInteraction?: boolean,
  [string]: any,
}) => (
  <div
    css={{
      display: 'flex',
      flexDirection: 'row',
      overflow: 'hidden',
      height: '100%',
      ...applyDisabledProperties(!!disableInteraction),
    }}
    {...props}
  />
);
