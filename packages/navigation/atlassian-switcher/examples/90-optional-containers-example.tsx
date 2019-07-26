import React from 'react';
import Button from '@atlaskit/button';
import Drawer from '@atlaskit/drawer';
import { mockEndpoints, REQUEST_FAST } from './helpers/mock-endpoints';
import { withAnalyticsLogger, withIntlProvider } from './helpers';
import AtlassianSwitcher from '../src';

class OptionalContainersExample extends React.Component {
  state = {
    isDrawerOpen: false,
    disableRecentContainers: false,
  };

  openDrawer = () => {
    mockEndpoints(
      'jira',
      originalMockData => {
        return {
          ...originalMockData,
          LICENSE_INFORMATION_DATA: {
            notUsedInMode: 'user-centric',
          },
        };
      },
      REQUEST_FAST,
    );
    this.setState({
      isDrawerOpen: true,
    });
  };

  onClose = () => {
    this.setState({
      isDrawerOpen: false,
    });
  };

  onTriggerXFlow = (productKey: string, sourceComponent: string) => {
    console.log(
      `Triggering xflow for => ${productKey} from ${sourceComponent}`,
    );
  };

  render() {
    const { disableRecentContainers } = this.state;

    return (
      <div style={{ padding: '2rem' }}>
        <Drawer onClose={this.onClose} isOpen={this.state.isDrawerOpen}>
          <AtlassianSwitcher
            product="jira"
            cloudId="some-cloud-id"
            disableRecentContainers={disableRecentContainers}
            enableUserCentricProducts
            triggerXFlow={this.onTriggerXFlow}
          />
        </Drawer>
        <Button type="button" onClick={this.openDrawer}>
          Open drawer
        </Button>
        <div style={{ width: 16 }} />
        <Button type="button" onClick={this.toggleDisableRecentContainers}>
          {disableRecentContainers
            ? 'Enable recent containers'
            : 'Disable recent containers'}
        </Button>
      </div>
    );
  }

  private toggleDisableRecentContainers = () => {
    this.setState({
      disableRecentContainers: !this.state.disableRecentContainers,
    });
  };
}

export default withIntlProvider(withAnalyticsLogger(OptionalContainersExample));
