import React from 'react';

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
};
