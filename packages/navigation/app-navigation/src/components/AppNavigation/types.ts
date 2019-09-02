import React from 'react';

import { AppNavigationTheme } from '../../theme';
import { ThemedPrimaryButtonProps } from '../PrimaryButton/types';

export type AppNavigationProps = {
  primaryItems: ThemedPrimaryButtonProps[];
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
