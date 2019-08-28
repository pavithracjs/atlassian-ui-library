import React from 'react';

import { DefaultAppSwitcher } from './shared/AppSwitcher';
import { DefaultCreate } from './shared/Create';
import { DefaultHelp } from './shared/Help';
import { mockEndpoints } from './shared/mock-atlassian-switcher-endpoints';
import {
  mockBuiltInNotifications,
  BuiltInNotifications,
} from './shared/Notifications';
import {
  bitbucketPrimaryItems,
  confluencePrimaryItems,
  jiraPrimaryItems,
  opsGeniePrimaryItems,
} from './shared/PrimaryItems';
import {
  BitbucketProductHome,
  ConfluenceProductHome,
  DefaultCustomProductHome,
  JiraProductHome,
  JiraServiceDeskProductHome,
  JiraSoftwareProductHome,
  OpsGenieProductHome,
} from './shared/ProductHome';
import { DefaultProfile } from './shared/Profile';
import { DefaultSearch } from './shared/Search';
import { DefaultSettings } from './shared/Settings';
import { AppNavigation } from '../src';

mockEndpoints('jira');
mockBuiltInNotifications();

const CustomProductHomeExample = () => (
  <div>
    <AppNavigation
      primaryItems={bitbucketPrimaryItems}
      renderAppSwitcher={DefaultAppSwitcher}
      renderCreate={DefaultCreate}
      renderHelp={DefaultHelp}
      renderNotifications={BuiltInNotifications}
      renderProductHome={BitbucketProductHome}
      renderProfile={DefaultProfile}
      renderSearch={DefaultSearch}
      renderSettings={DefaultSettings}
    />
    <br />
    <AppNavigation
      primaryItems={confluencePrimaryItems}
      renderAppSwitcher={DefaultAppSwitcher}
      renderCreate={DefaultCreate}
      renderHelp={DefaultHelp}
      renderNotifications={BuiltInNotifications}
      renderProductHome={ConfluenceProductHome}
      renderProfile={DefaultProfile}
      renderSearch={DefaultSearch}
      renderSettings={DefaultSettings}
    />
    <br />
    <AppNavigation
      primaryItems={jiraPrimaryItems}
      renderAppSwitcher={DefaultAppSwitcher}
      renderCreate={DefaultCreate}
      renderHelp={DefaultHelp}
      renderNotifications={BuiltInNotifications}
      renderProductHome={JiraProductHome}
      renderProfile={DefaultProfile}
      renderSearch={DefaultSearch}
      renderSettings={DefaultSettings}
    />
    <br />
    <AppNavigation
      primaryItems={jiraPrimaryItems}
      renderAppSwitcher={DefaultAppSwitcher}
      renderCreate={DefaultCreate}
      renderHelp={DefaultHelp}
      renderNotifications={BuiltInNotifications}
      renderProductHome={JiraServiceDeskProductHome}
      renderProfile={DefaultProfile}
      renderSearch={DefaultSearch}
      renderSettings={DefaultSettings}
    />
    <br />
    <AppNavigation
      primaryItems={jiraPrimaryItems}
      renderAppSwitcher={DefaultAppSwitcher}
      renderCreate={DefaultCreate}
      renderHelp={DefaultHelp}
      renderNotifications={BuiltInNotifications}
      renderProductHome={JiraSoftwareProductHome}
      renderProfile={DefaultProfile}
      renderSearch={DefaultSearch}
      renderSettings={DefaultSettings}
    />
    <br />
    <AppNavigation
      primaryItems={opsGeniePrimaryItems}
      renderAppSwitcher={DefaultAppSwitcher}
      renderCreate={DefaultCreate}
      renderHelp={DefaultHelp}
      renderNotifications={BuiltInNotifications}
      renderProductHome={OpsGenieProductHome}
      renderProfile={DefaultProfile}
      renderSearch={DefaultSearch}
      renderSettings={DefaultSettings}
    />
    <br />
    <AppNavigation
      primaryItems={jiraPrimaryItems}
      renderAppSwitcher={DefaultAppSwitcher}
      renderCreate={DefaultCreate}
      renderHelp={DefaultHelp}
      renderNotifications={BuiltInNotifications}
      renderProductHome={DefaultCustomProductHome}
      renderProfile={DefaultProfile}
      renderSearch={DefaultSearch}
      renderSettings={DefaultSettings}
    />
  </div>
);

export default CustomProductHomeExample;
