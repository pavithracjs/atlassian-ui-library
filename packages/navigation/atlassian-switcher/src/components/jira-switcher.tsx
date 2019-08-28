import * as React from 'react';
import { Messages } from 'react-intl';
import Switcher from '../primitives/themed-switcher';
import {
  CustomLinksProvider,
  MANAGE_HREF,
} from '../providers/jira-data-providers';
import CommonDataProvider from '../providers/common-data-provider';
import { mapResultsToSwitcherProps } from '../utils/map-results-to-switcher-props';
import {
  FeatureMap,
  AvailableProductsResponse,
  RecommendationsFeatureFlags,
  DiscoverMoreCallback,
  TriggerXFlowCallback,
} from '../types';
import { AvailableProductsProvider } from '../providers/products-data-provider';
import { ProviderResult } from '../providers/as-data-provider';
import { WithTheme } from '../theme/types';

type JiraSwitcherProps = WithTheme & {
  cloudId: string;
  messages: Messages;
  features: FeatureMap;
  triggerXFlow: TriggerXFlowCallback;
  onDiscoverMoreClicked: DiscoverMoreCallback;
  recommendationsFeatureFlags?: RecommendationsFeatureFlags;
};

export default (props: JiraSwitcherProps) => (
  <CustomLinksProvider disableCustomLinks={props.features.disableCustomLinks}>
    {customLinks => (
      <AvailableProductsProvider
        isUserCentric={props.features.enableUserCentricProducts}
      >
        {(availableProducts: ProviderResult<AvailableProductsResponse>) => (
          <CommonDataProvider
            cloudId={props.cloudId}
            disableRecentContainers={props.features.disableRecentContainers}
            isUserCentric={props.features.enableUserCentricProducts}
            recommendationsFeatureFlags={props.recommendationsFeatureFlags}
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
