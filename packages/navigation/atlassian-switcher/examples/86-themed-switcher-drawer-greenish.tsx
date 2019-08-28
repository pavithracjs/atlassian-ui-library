import * as React from 'react';
import AtlassianIcon from '@atlaskit/icon/glyph/atlassian';
import Navigation, { AkGlobalItem } from '@atlaskit/navigation';
import Page, { Grid, GridColumn } from '@atlaskit/page';
import SwitcherIcon from '@atlaskit/icon/glyph/app-switcher';
import * as colors from '@atlaskit/theme/colors';
import AkDrawer from '@atlaskit/drawer';
import { mockEndpoints, REQUEST_MEDIUM } from './helpers/mock-endpoints';
import { withAnalyticsLogger, withIntlProvider } from './helpers';
import AtlassianSwitcher from '../src';
import ColorScheme from './helpers/ColorScheme';
import Tooltip from '@atlaskit/tooltip';

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
    const greenishColorScheme = {
      primaryTextColor: '#006400',
      secondaryTextColor: '#4ca64c',
      primaryHoverBackgroundColor: '#cce5cc',
      secondaryHoverBackgroundColor: '#e5f2e5',
    };

    return (
      <Page
        navigation={
          <Navigation
            drawers={[
              <AkDrawer
                key="switcher"
                isOpen={this.state.isDrawerOpen}
                onClose={this.onClose}
              >
                <AtlassianSwitcher
                  product="site-admin"
                  cloudId="some-cloud-id"
                  triggerXFlow={this.onTriggerXFlow}
                  isDiscoverMoreForEveryoneEnabled
                  onDiscoverMoreClicked={this.onDiscoverMoreClicked}
                  enableUserCentricProducts
                  theme={greenishColorScheme}
                />
              </AkDrawer>,
            ]}
            globalPrimaryIcon={<AtlassianIcon size="large" label="Atlassian" />}
            globalPrimaryItemHref="/"
            globalSecondaryActions={[
              <AkGlobalItem
                key="switcher-global-item"
                onClick={this.openDrawer}
              >
                <Tooltip content="Switch apps" position="right">
                  <SwitcherIcon
                    label="Switch apps"
                    size="medium"
                    primaryColor={colors.N0}
                    secondaryColor={colors.N800}
                  />
                </Tooltip>
              </AkGlobalItem>,
            ]}
          />
        }
      >
        <Grid layout="fixed">
          <GridColumn medium={12}>
            <ColorScheme colorScheme={greenishColorScheme} />
          </GridColumn>
        </Grid>
      </Page>
    );
  }
}

export default withIntlProvider(withAnalyticsLogger(SwitcherExample));
