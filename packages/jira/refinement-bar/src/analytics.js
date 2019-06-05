// @flow

import * as analytics from '@atlaskit/analytics-next';
import { name as packageName, version as packageVersion } from './version.json';

export const { withAnalyticsContext, withAnalyticsEvents } = analytics;
export const createAndFire = analytics.createAndFireEvent('atlaskit');
export const defaultAttributes = {
  componentName: 'refinement-bar',
  packageName,
  packageVersion,
};
