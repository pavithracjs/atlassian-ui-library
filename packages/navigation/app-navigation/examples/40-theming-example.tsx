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
import { AppNavigation, darkTheme, generateMode, lightTheme } from '../src';
import { Colors } from '../src/theme/modeGenerator';

mockEndpoints('jira');
mockBuiltInNotifications();

const generateTheme = (primary: Colors) => ({
  mode: generateMode({ primary }),
});

const customThemes = [
  // Red
  generateTheme({
    backgroundColor: '#ff3e15',
    color: '#fff',
  }),
  // Orange
  generateTheme({
    backgroundColor: '#ff8c19',
    color: '#fff',
  }),
  // Yellow
  generateTheme({
    backgroundColor: '#ffff00',
    color: '#000',
  }),
  // Green
  generateTheme({
    backgroundColor: '#0fdc60',
    color: '#fff',
  }),
  // Blue
  generateTheme({
    backgroundColor: '#3babfd',
    color: '#fff',
  }),
  // Violet
  generateTheme({
    backgroundColor: '#4f1c82',
    color: '#fff',
  }),
  // Pink
  generateTheme({
    backgroundColor: '#fec8d8',
    color: '#000',
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
        {i < themes.length && <br />}
      </Fragment>
    ))}
  </div>
);

export default ThemingExample;
