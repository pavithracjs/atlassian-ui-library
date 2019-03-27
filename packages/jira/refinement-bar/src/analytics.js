// @flow

import * as x from '@atlaskit/analytics-next';
import {
  name as packageName,
  version as packageVersion,
} from '../package.json';

export const withAnalyticsEvents = x.withAnalyticsEvents;
export const withAnalyticsContext = x.withAnalyticsContext;
export const createAndFire = x.createAndFireEvent('atlaskit');
export const defaultAttributes = {
  componentName: 'refinement-bar',
  packageName,
  packageVersion,
};
