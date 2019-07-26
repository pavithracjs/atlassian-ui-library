import * as React from 'react';
import { Messages } from 'react-intl';
import Switcher from './switcher';
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
  CustomLink,
} from '../types';
import { AvailableProductsProvider } from '../providers/products-data-provider';
import { ProviderResult } from '../providers/as-data-provider';

type JiraSwitcherProps = {
  cloudId: string;
  messages: Messages;
  features: FeatureMap;
  triggerXFlow: (productKey: string, sourceComponent: string) => void;
  recommendationsFeatureFlags?: RecommendationsFeatureFlags;
};

const getAvailableProductsProvider = (
  props: JiraSwitcherProps,
  customLinks?: ProviderResult<CustomLink[]>,
) => (
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
            customLinks ? { customLinks, ...providerResults } : providerResults,
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
);

export default (props: JiraSwitcherProps) =>
  props.features.disableCustomLinks ? (
    getAvailableProductsProvider(props)
  ) : (
    <CustomLinksProvider>
      {customLinks => getAvailableProductsProvider(props, customLinks)}
    </CustomLinksProvider>
  );
