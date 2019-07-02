// @flow

import type { ComponentType, Node } from 'react';

import type { ProductTheme } from '../../../theme';

export type ContentNavigationProps = {
  container?: ?ComponentType<{}>,
  isVisible: boolean,
  product: ComponentType<{}>,
  experimental_hideNavVisuallyOnCollapse: boolean,
};

export type ContentNavigationState = {|
  cachedContainer: ?ComponentType<{||}>,
|};

export type ContainerNavigationPrimitiveProps = {|
  children: Node,
  isEntering: boolean,
  isExiting: boolean,
  isVisible: boolean,
|};

export type ContainerNavigationPrimitiveBaseProps = {|
  ...ContainerNavigationPrimitiveProps,
  theme: ProductTheme,
|};
