import AtlassianSwitcher from '@atlaskit/atlassian-switcher';
import React from 'react';
import { IntlProvider } from 'react-intl';

import { AppSwitcher } from '../../src';

const DrawerContent = () => {
  return (
    <IntlProvider>
      <AtlassianSwitcher
        product="jira"
        cloudId="some-cloud-id"
        triggerXFlow={() => undefined}
      />
    </IntlProvider>
  );
};

const onClick = (...args: any[]) => {
  console.log('app switcher click', ...args);
};

const onDrawerClose = (...args: any[]) => {
  console.log('app switcher close', ...args);
};

const onDrawerCloseComplete = (...args: any[]) => {
  console.log('app switcher close complete', ...args);
};

export const DefaultAppSwitcher = () => (
  <AppSwitcher
    drawerContent={DrawerContent}
    onClick={onClick}
    onClose={onDrawerClose}
    onDrawerCloseComplete={onDrawerCloseComplete}
    tooltip="Switch to..."
  />
);
