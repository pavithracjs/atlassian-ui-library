import * as React from 'react';
import Drawer from '@atlaskit/drawer';
import Button from '@atlaskit/button';
import { mockEndpoints, REQUEST_MEDIUM } from './helpers/mock-endpoints';
import { withAnalyticsLogger, withIntlProvider } from './helpers';
import AtlassianSwitcher from '../src';

class SwitcherExample extends React.Component {
  state = {
    isDrawerOpen: false,
  };

  componentDidMount() {
    this.openDrawer();
  }

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
      REQUEST_MEDIUM,
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

  onDiscoverMoreClicked = () => {
    console.log(`Triggering discover more!`);
  };

  onTriggerXFlow = (productKey: string, sourceComponent: string) => {
    console.log(
      `Triggering xflow for => ${productKey} from ${sourceComponent}`,
    );
  };

  render() {
    const blueishColorScheme = {
      secondaryTextColor: '#03396c',
      primaryHoverBackgroundColor: '#ccffff',
    };

    return (
      <div style={{ padding: '2rem' }}>
        <Drawer onClose={this.onClose} isOpen={this.state.isDrawerOpen}>
          <AtlassianSwitcher
            product="site-admin"
            cloudId="some-cloud-id"
            triggerXFlow={this.onTriggerXFlow}
            isDiscoverMoreForEveryoneEnabled
            onDiscoverMoreClicked={this.onDiscoverMoreClicked}
            enableUserCentricProducts
            theme={blueishColorScheme}
          />
        </Drawer>
        <Button type="button" onClick={this.openDrawer}>
          Open user-centric drawer
        </Button>
      </div>
    );
  }
}

export default withIntlProvider(withAnalyticsLogger(SwitcherExample));
