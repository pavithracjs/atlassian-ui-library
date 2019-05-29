import React from 'react';
import { UIAnalyticsEvent } from '@atlaskit/analytics-next';

export type KeyboardOrMouseEvent =
  | React.MouseEvent<any>
  | React.KeyboardEvent<any>;
export type AppearanceType = 'danger' | 'warning';

export type ButtonOnClick = (
  e: React.MouseEvent<HTMLElement>,
  analyticsEvent: UIAnalyticsEvent,
) => void;
