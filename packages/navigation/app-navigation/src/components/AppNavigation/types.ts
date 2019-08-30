import React from 'react';

import { AppNavigationTheme } from '../../theme';
import { PrimaryButtonProps } from '../PrimaryButton/types';

export type AppNavigationProps = {
  primaryItems: PrimaryButtonProps[];
  renderAppSwitcher?: React.ComponentType<{}>;
  renderCreate?: React.ComponentType<{}>;
  renderHelp?: React.ComponentType<{}>;
  renderNotifications?: React.ComponentType<{}>;
  renderProductHome: React.ComponentType<{}>;
  renderProfile: React.ComponentType<{}>;
  renderSearch?: React.ComponentType<{}>;
  renderSettings?: React.ComponentType<{}>;
  theme?: AppNavigationTheme;
};

export type AppNavigationSkeletonProps = {
  primaryItemsCount?: number;
  secondaryItemsCount?: number;
  theme?: AppNavigationTheme;
};
