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
import { AppNavigation, darkTheme, generateTheme, lightTheme } from '../src';

mockEndpoints('jira');
mockBuiltInNotifications();

const customThemes = [
  // Red
  generateTheme({
    primary: {
      backgroundColor: '#ff3e15',
      color: '#ffffff',
    },
  }),
  // Orange
  generateTheme({
    primary: {
      backgroundColor: '#ff8c19',
      color: '#ffffff',
    },
  }),
  // Yellow
  generateTheme({
    primary: {
      backgroundColor: '#ffff00',
      color: '#000000',
    },
  }),
  // Green
  generateTheme({
    primary: {
      backgroundColor: '#0fdc60',
      color: '#ffffff',
    },
  }),
  // Blue
  generateTheme({
    primary: {
      backgroundColor: '#3babfd',
      color: '#ffffff',
    },
  }),
  // Violet
  generateTheme({
    primary: {
      backgroundColor: '#4f1c82',
      color: '#ffffff',
    },
  }),
  // Pink
  generateTheme({
    primary: {
      backgroundColor: '#fec8d8',
      color: '#000000',
    },
  }),
];

const themes = [lightTheme, darkTheme, ...customThemes];

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
