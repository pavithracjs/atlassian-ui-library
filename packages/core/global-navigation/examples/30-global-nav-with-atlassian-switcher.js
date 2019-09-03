// @flow

import React, { Component } from 'react';
import { IntlProvider } from 'react-intl';
import EmojiAtlassianIcon from '@atlaskit/icon/glyph/emoji/atlassian';
import { LayoutManager, NavigationProvider } from '@atlaskit/navigation-next';
import { AnalyticsListener } from '@atlaskit/analytics-next';
import { mockEndpoints } from './helpers/mock-atlassian-switcher-endpoints';

import GlobalNavigation from '../src';

const getGlobalNavigation = () => (
  <AnalyticsListener
    channel="navigation"
    onEvent={analyticsEvent => {
      const { payload, context } = analyticsEvent;
      const eventId = `${payload.actionSubject ||
        payload.name} ${payload.action || payload.eventType}`;
      console.log(`Received event [${eventId}]: `, {
        payload,
        context,
      });
    }}
  >
    <GlobalNavigation
      product="jira"
      productHref="#"
      cloudId="some-cloud-id"
      productIcon={EmojiAtlassianIcon}
      onProductClick={() => console.log('product clicked')}
      onCreateClick={() => console.log('create clicked')}
      onSearchClick={() => console.log('search clicked')}
      onStarredClick={() => console.log('starred clicked')}
      onHelpClick={() => console.log('help clicked')}
      helpItems={() => <div />}
      onNotificationClick={() => console.log('notification clicked')}
      onSettingsClick={() => console.log('settings clicked')}
      loginHref="#login"
      appSwitcherTooltip="Switch to ..."
      enableAtlassianSwitcher
      triggerXFlow={(...props) => {
        console.log('TRIGGERING XFLOW', props);
      }}
    />
  </AnalyticsListener>
);

type State = {
  enableAtlassianSwitcher: boolean,
};

export default class extends Component<{}, State> {
  state = {
    enableAtlassianSwitcher: true,
  };

  componentDidMount() {
    mockEndpoints();
  }

  toggleStateValue = (stateProp: string) => () => {
    const statePropValue = this.state[stateProp];
    this.setState({
      [stateProp]: !statePropValue,
    });
  };

  render() {
    return (
      <IntlProvider>
        <NavigationProvider>
          <LayoutManager
            globalNavigation={getGlobalNavigation}
            productNavigation={() => null}
            containerNavigation={() => null}
          >
            <div css={{ padding: '32px 40px' }}>Page content</div>
          </LayoutManager>
        </NavigationProvider>
      </IntlProvider>
    );
  }
}
