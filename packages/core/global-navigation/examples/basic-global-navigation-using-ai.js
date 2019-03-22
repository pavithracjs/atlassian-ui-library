// @flow

import React from 'react';
import EmojiAtlassianIcon from '@atlaskit/icon/glyph/emoji/atlassian';
import { LayoutManager, NavigationProvider } from '@atlaskit/navigation-next';
// import AppSwitcherIcon from '@atlaskit/icon/glyph/app-switcher';

import GlobalNavigation from '../src';

// const AppSwitcherComponent = props => (
//   <GlobalItem
//     {...props}
//     icon={AppSwitcherIcon}
//     id="test"
//     onClick={() => console.log('AppSwitcher clicked')}
//   />
// );

// TODO: make onClicks targets show up on page instead of console.logs
const Global = () => (
  <GlobalNavigation
    productIcon={EmojiAtlassianIcon}
    productHref="#"
    onProductClick={() => alert('Product clicked')}
    onCreateClick={() => alert('create clicked')}
    onSearchClick={() =>
      alert(
        'the search button was clicked as its image has a prediction of 0.978410',
      )
    }
    onStarredClick={() => alert('starred clicked')}
    onNotificationClick={() => alert('notification clicked')}
    onSettingsClick={() => alert('settings clicked')}
  />
);

export default () => (
  <NavigationProvider>
    <LayoutManager
      globalNavigation={Global}
      productNavigation={() => null}
      containerNavigation={() => null}
    >
      <div css={{ padding: '32px 40px' }}>Page content</div>
    </LayoutManager>
  </NavigationProvider>
);
