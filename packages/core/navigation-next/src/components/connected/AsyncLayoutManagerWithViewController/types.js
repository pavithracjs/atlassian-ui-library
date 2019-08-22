// @flow

import type { ComponentType, Node } from 'react';
import type { WithNavigationUIControllerProps } from '../../../ui-controller/types';
import type {
  CollapseListeners,
  ExperimentalFeatureFlags,
  GetRefs,
} from '../../presentational/LayoutManager/types';
import type { ActiveView } from '../../../view-controller/types';

type Dataset = { [name: string]: string | typeof undefined };
export type AsyncLayoutManagerWithViewControllerProps = {|
  ...$Exact<CollapseListeners>,
  ...$Exact<ExperimentalFeatureFlags>,
  ...$Exact<WithNavigationUIControllerProps>,
  children: Node,
  containerSkeleton: ComponentType<{}>,
  customComponents?: { [string]: ComponentType<*> },
  datasets?: {|
    globalNavigation: Dataset,
    contextualNavigation: Dataset,
    navigation: Dataset,
  |},
  firstSkeletonToRender?: 'product' | 'container',
  getRefs?: GetRefs,
  globalNavigation: ComponentType<{}>,
  itemsRenderer: ComponentType<*>,
  view: ?ActiveView,
  shouldHideGlobalNavShadow?: boolean,
  topOffset?: number,
|};

export type AsyncLayoutManagerWithViewControllerState = {
  hasInitialised: boolean,
  outgoingView: ?ActiveView,
};
