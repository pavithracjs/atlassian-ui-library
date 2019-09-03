import * as React from 'react';
import { Messages } from 'react-intl';
import Switcher from '../primitives/themed-switcher';
import CommonDataProvider from '../providers/common-data-provider';
import {
  Product,
  FeatureMap,
  DiscoverMoreCallback,
  TriggerXFlowCallback,
} from '../types';
import { mapResultsToSwitcherProps } from '../utils/map-results-to-switcher-props';
import { AvailableProductsProvider } from '../providers/products-data-provider';
import { WithTheme } from '../theme/types';

type GenericSwitcherProps = WithTheme & {
  cloudId?: string;
  messages: Messages;
  features: FeatureMap;
  triggerXFlow: TriggerXFlowCallback;
  onDiscoverMoreClicked: DiscoverMoreCallback;
  product: Exclude<Product, Product.JIRA | Product.CONFLUENCE>;
};

export default (props: GenericSwitcherProps) => (
  <AvailableProductsProvider
    isUserCentric={props.features.enableUserCentricProducts}
  >
    {availableProducts => (
      <CommonDataProvider
        cloudId={props.cloudId}
        isUserCentric={Boolean(props.features.enableUserCentricProducts)}
        disableRecentContainers={props.features.disableRecentContainers}
      >
        {providerResults => {
          const switcherLinks = mapResultsToSwitcherProps(
            props.cloudId,
            providerResults,
            props.features,
            availableProducts,
          );

          return <Switcher {...props} {...switcherLinks} />;
        }}
      </CommonDataProvider>
    )}
  </AvailableProductsProvider>
);
