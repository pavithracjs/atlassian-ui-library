import React, { Fragment } from 'react';

import { DefaultAppSwitcher } from './shared/AppSwitcher';
import { DefaultCreate } from './shared/Create';
import { DefaultHelp } from './shared/Help';
import { mockEndpoints } from './shared/mock-atlassian-switcher-endpoints';
import {
  mockBuiltInNotifications,
  BuiltInNotifications,
} from './shared/Notifications';
import { defaultPrimaryItems } from './shared/PrimaryItems';
import { DefaultProductHome } from './shared/ProductHome';
import { DefaultProfile } from './shared/Profile';
import { DefaultSearch } from './shared/Search';
import { DefaultSettings } from './shared/Settings';
import { themes } from './shared/themes';
import { AppNavigation } from '../src';

mockEndpoints('jira');
mockBuiltInNotifications();

const ThemingExample = () => (
  <div>
    {themes.map((theme, i) => (
      <Fragment key={i}>
        <AppNavigation
          primaryItems={defaultPrimaryItems}
          renderAppSwitcher={DefaultAppSwitcher}
          renderCreate={DefaultCreate}
          renderHelp={DefaultHelp}
          renderNotifications={BuiltInNotifications}
          renderProductHome={DefaultProductHome}
          renderProfile={DefaultProfile}
          renderSearch={DefaultSearch}
          renderSettings={DefaultSettings}
          theme={theme}
        />
        {i < themes.length - 1 && <br />}
      </Fragment>
    ))}
  </div>
);

export default ThemingExample;
