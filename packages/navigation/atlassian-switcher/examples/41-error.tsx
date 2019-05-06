import * as React from 'react';
import Drawer from '@atlaskit/drawer';
import Button from '@atlaskit/button';
import { withAnalyticsLogger, withIntlProvider } from './helpers';
import { mockEndpoints, REQUEST_FAST } from './helpers/mock-endpoints';
import { enrichFetchError } from '../src/utils/fetch';
import AtlassianSwitcher from '../src';

class ErrorExample extends React.Component {
  state = {
    isDrawerOpen: false,
  };

  componentDidMount() {
    this.openDrawer();
  }

  openDrawer = (error?: any) => {
    mockEndpoints(
      'jira',
      originalMockData => {
        return {
          ...originalMockData,
          LICENSE_INFORMATION_DATA: Promise.reject(error),
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
    return (
      <div style={{ padding: '2rem' }}>
        <Drawer onClose={this.onClose} isOpen={this.state.isDrawerOpen}>
          <AtlassianSwitcher
            product="jira"
            cloudId="some-cloud-id"
            triggerXFlow={this.onTriggerXFlow}
          />
        </Drawer>
        <Button type="button" onClick={this.openDrawer}>
          Open drawer
        </Button>
        |
        <Button
          type="button"
          onClick={() =>
            this.openDrawer(enrichFetchError(new Error('Failed to fetch'), 401))
          }
        >
          HTTP 401
        </Button>
        |
        <Button
          type="button"
          onClick={() =>
            this.openDrawer(enrichFetchError(new Error('Failed to fetch'), 403))
          }
        >
          HTTP 403
        </Button>
        |
        <Button
          type="button"
          onClick={() =>
            this.openDrawer(enrichFetchError(new Error('Failed to fetch'), 500))
          }
        >
          HTTP 5xx
        </Button>
      </div>
    );
  }
}

export default withIntlProvider(withAnalyticsLogger(ErrorExample));
