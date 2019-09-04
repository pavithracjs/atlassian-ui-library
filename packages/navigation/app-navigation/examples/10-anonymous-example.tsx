import React from 'react';

import { DefaultAppSwitcher } from './shared/AppSwitcher';
import { DefaultCreate } from './shared/Create';
import { DefaultHelp } from './shared/Help';
import { mockEndpoints } from './shared/mock-atlassian-switcher-endpoints';
import { defaultPrimaryItems } from './shared/PrimaryItems';
import { DefaultProductHome } from './shared/ProductHome';
import { AnonymousProfile } from './shared/Profile';
import { DefaultSearch } from './shared/Search';
import { AppNavigation } from '../src';

mockEndpoints('jira');

const AnonymousExample = () => (
  <AppNavigation
    primaryItems={defaultPrimaryItems}
    renderAppSwitcher={DefaultAppSwitcher}
    renderCreate={DefaultCreate}
    renderHelp={DefaultHelp}
    renderProductHome={DefaultProductHome}
    renderProfile={AnonymousProfile}
    renderSearch={DefaultSearch}
  />
);

export default AnonymousExample;
