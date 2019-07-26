import * as React from 'react';
import { Messages } from 'react-intl';
import Switcher from './switcher';
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
  CustomLink,
} from '../types';
import { ProviderResult } from '../providers/as-data-provider';
import { AvailableProductsProvider } from '../providers/products-data-provider';

type ConfluenceSwitcherProps = {
  cloudId: string;
  messages: Messages;
  features: FeatureMap;
  triggerXFlow: (productKey: string, sourceComponent: string) => void;
  recommendationsFeatureFlags?: RecommendationsFeatureFlags;
};

const getAvailableProductsProvider = (
  props: ConfluenceSwitcherProps,
  customLinks?: ProviderResult<CustomLink[]>,
) => (
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

export default (props: ConfluenceSwitcherProps) =>
  props.features.disableCustomLinks ? (
    getAvailableProductsProvider(props)
  ) : (
    <CustomLinksProvider>
      {customLinks => getAvailableProductsProvider(props, customLinks)}
    </CustomLinksProvider>
  );
