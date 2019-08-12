import React from 'react';
import Button from '@atlaskit/button';
import Drawer from '@atlaskit/drawer';
import { mockEndpoints, REQUEST_FAST } from './helpers/mock-endpoints';
import { withAnalyticsLogger, withIntlProvider } from './helpers';
import AtlassianSwitcher from '../src';
import { ProductTopItemVariation } from '@atlaskit/atlassian-switcher/types';

class OptionalContainersExample extends React.Component {
  state = {
    isDrawerOpen: false,
    enableUserCentricProducts: true,
    disableCustomLinks: false,
    disableRecentContainers: false,
    disableCloudId: false,
    disableXFlow: false,
    productTopItemVariation: ProductTopItemVariation.mostFrequentSite,
  };

  openDrawer = () => {
    mockEndpoints(
      'jira',
      originalMockData => {
        return {
          ...originalMockData,
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
    const {
      disableRecentContainers,
      disableCloudId,
      disableXFlow,
      enableUserCentricProducts,
      disableCustomLinks,
      productTopItemVariation,
    } = this.state;

    return (
      <div style={{ padding: '2rem' }}>
        <Drawer onClose={this.onClose} isOpen={this.state.isDrawerOpen}>
          <AtlassianSwitcher
            product="jira"
            cloudId={disableCloudId ? undefined : 'some-cloud-id'}
            disableRecentContainers={disableRecentContainers}
            disableCustomLinks={disableCustomLinks}
            enableUserCentricProducts={enableUserCentricProducts}
            triggerXFlow={disableXFlow ? undefined : this.onTriggerXFlow}
            productTopItemVariation={productTopItemVariation}
          />
        </Drawer>
        <Button type="button" onClick={this.openDrawer}>
          Open drawer
        </Button>

        <h5 style={{ paddingBottom: '10px' }}>Optional togglable props</h5>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            flexDirection: 'column',
            width: 'fit-content',
            height: '200px',
          }}
        >
          <Button
            type="button"
            onClick={this.toggleDisableCloudId}
            isSelected={!disableCloudId}
          >
            Cloud ID
          </Button>
          <Button
            type="button"
            onClick={this.toggleDisableXFlow}
            isSelected={!disableXFlow}
          >
            XFlow
          </Button>
          <Button
            type="button"
            onClick={this.toggleEnableUserCentric}
            isSelected={enableUserCentricProducts}
          >
            User-centric products
          </Button>
          <Button
            type="button"
            onClick={this.toggleDisableRecentContainers}
            isSelected={!disableRecentContainers}
          >
            Recent containers
          </Button>
          <Button
            type="button"
            onClick={this.toggleDisableCustomLinks}
            isSelected={!disableCustomLinks}
          >
            Custom links
          </Button>
          <Button type="button" onClick={this.toggleProductTopItemVariation}>
            Product top item is {productTopItemVariation}
          </Button>
        </div>
      </div>
    );
  }

  private toggleDisableRecentContainers = () => {
    this.setState({
      disableRecentContainers: !this.state.disableRecentContainers,
    });
  };

  private toggleDisableCloudId = () => {
    this.setState({
      disableCloudId: !this.state.disableCloudId,
    });
  };

  private toggleDisableXFlow = () => {
    this.setState({
      disableXFlow: !this.state.disableXFlow,
    });
  };

  private toggleEnableUserCentric = () => {
    this.setState({
      enableUserCentricProducts: !this.state.enableUserCentricProducts,
    });
  };

  private toggleDisableCustomLinks = () => {
    this.setState({
      disableCustomLinks: !this.state.disableCustomLinks,
    });
  };

  private toggleProductTopItemVariation = () => {
    const { productTopItemVariation } = this.state;
    this.setState({
      productTopItemVariation:
        productTopItemVariation === ProductTopItemVariation.mostFrequentSite
          ? ProductTopItemVariation.currentSite
          : ProductTopItemVariation.mostFrequentSite,
    });
  };
}

export default withIntlProvider(withAnalyticsLogger(OptionalContainersExample));
