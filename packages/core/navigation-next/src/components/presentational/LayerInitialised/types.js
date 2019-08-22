// @flow

import type { ViewControllerState } from '../../../view-controller/types';

export type LayerInitialisedProps = {
  createAnalyticsEvent: Function,
  activeView: $PropertyType<ViewControllerState, 'activeView'>,
  initialised: boolean,
  onInitialised?: () => void,
};
