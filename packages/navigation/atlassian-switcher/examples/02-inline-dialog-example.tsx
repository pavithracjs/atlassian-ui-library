import * as React from 'react';
import Button from '@atlaskit/button';
import InlineDialog from '@atlaskit/inline-dialog';
import { mockEndpoints, REQUEST_FAST } from './helpers/mock-endpoints';
import { withAnalyticsLogger, withIntlProvider } from './helpers';
import AtlassianSwitcher from '../src';

class InlineDialogSwitcherExample extends React.Component {
  state = {
    isOpen: false,
  };

  openDrawer = () => {
    mockEndpoints(
      'jira',
      originalMockData => {
        return {
          ...originalMockData,
          RECENT_CONTAINERS_DATA: {
            data: [],
          },
          CUSTOM_LINKS_DATA: {
            data: [],
          },
          XFLOW_SETTINGS: {},

          LICENSE_INFORMATION_DATA: {
            hostname: 'https://some-random-instance.atlassian.net',
            firstActivationDate: 1492488658539,
            maintenanceEndDate: '2017-04-24',
            maintenanceStartDate: '2017-04-17',
            products: {
              'jira-software.ondemand': {
                billingPeriod: 'ANNUAL',
                state: 'ACTIVE',
              },
            },
          },
        };
      },
      REQUEST_FAST,
    );
    this.setState({
      isOpen: true,
    });
  };

  onClose = () => {
    this.setState({
      isOpen: false,
    });
  };

  onTriggerXFlow = (productKey: string, sourceComponent: string) => {
    console.log(
      `Triggering xflow for => ${productKey} from ${sourceComponent}`,
    );
  };

  render() {
    return (
      <InlineDialog
        onClose={this.onClose}
        isOpen={this.state.isOpen}
        content={
          <div
            style={{
              maxHeight: 'inherit',
              maxWidth: 'inherit',
              overflow: 'auto',
            }}
          >
            <AtlassianSwitcher
              product="trello"
              disableCustomLinks
              disableRecentContainers
              disableHeadings
              cloudId="some-cloud-id"
              triggerXFlow={this.onTriggerXFlow}
              appearance="standalone"
            />
          </div>
        }
      >
        <Button type="button" onClick={this.openDrawer}>
          Click to open inline dialog
        </Button>
      </InlineDialog>
    );
  }
}

export default withIntlProvider(
  withAnalyticsLogger(InlineDialogSwitcherExample),
);
