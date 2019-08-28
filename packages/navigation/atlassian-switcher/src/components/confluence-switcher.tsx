import * as React from 'react';
import { Messages } from 'react-intl';
import Switcher from '../primitives/themed-switcher';
import {
  CustomLinksProvider,
  MANAGE_HREF,
} from '../providers/confluence-data-providers';
import CommonDataProvider from '../providers/common-data-provider';
import { mapResultsToSwitcherProps } from '../utils/map-results-to-switcher-props';
import {
  FeatureMap,
  AvailableProductsResponse,
  RecommendationsFeatureFlags,
  DiscoverMoreCallback,
  TriggerXFlowCallback,
} from '../types';
import { ProviderResult } from '../providers/as-data-provider';
import { AvailableProductsProvider } from '../providers/products-data-provider';
import { WithTheme } from '../theme/types';

type ConfluenceSwitcherProps = WithTheme & {
  cloudId: string;
  messages: Messages;
  features: FeatureMap;
  triggerXFlow: TriggerXFlowCallback;
  onDiscoverMoreClicked: DiscoverMoreCallback;
  recommendationsFeatureFlags?: RecommendationsFeatureFlags;
};

export default (props: ConfluenceSwitcherProps) => (
  <CustomLinksProvider disableCustomLinks={props.features.disableCustomLinks}>
    {customLinks => (
      <AvailableProductsProvider
        isUserCentric={props.features.enableUserCentricProducts}
      >
        {(availableProducts: ProviderResult<AvailableProductsResponse>) => (
          <CommonDataProvider
            cloudId={props.cloudId}
            isUserCentric={props.features.enableUserCentricProducts}
            disableRecentContainers={props.features.disableRecentContainers}
          >
            {providerResults => {
              const {
                showManageLink,
                ...switcherLinks
              } = mapResultsToSwitcherProps(
                props.cloudId,
                { customLinks, ...providerResults },
                props.features,
                availableProducts,
              );

              return (
                <Switcher
                  {...props}
                  {...switcherLinks}
                  manageLink={showManageLink ? MANAGE_HREF : undefined}
                />
              );
            }}
          </CommonDataProvider>
        )}
      </AvailableProductsProvider>
    )}
  </CustomLinksProvider>
);
