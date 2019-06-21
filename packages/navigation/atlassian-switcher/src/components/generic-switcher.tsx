import * as React from 'react';
import { Messages } from 'react-intl';
import Switcher from './switcher';
import CommonDataProvider from '../providers/common-data-provider';
import { Product, FeatureFlagProps, AvailableProductsResponse } from '../types';
import { mapResultsToSwitcherProps } from '../utils/map-results-to-switcher-props';
import { AvailableProductsProvider } from '../providers/products-data-provider';
import { ProviderResult } from '../providers/as-data-provider';

type GenericSwitcherProps = {
  cloudId: string;
  messages: Messages;
  features: FeatureFlagProps;
  triggerXFlow: (productKey: string, sourceComponent: string) => void;
  product: Exclude<Product, Product.JIRA | Product.CONFLUENCE>;
};

const getFeatures = (
  product: Exclude<Product, Product.JIRA | Product.CONFLUENCE>,
) => {
  switch (product) {
    case Product.SITE_ADMIN:
    case Product.TRUSTED_ADMIN:
    case Product.HOME:
      return {
        xflow: true,
      };
    case Product.PEOPLE:
    default:
      return {
        xflow: false,
      };
  }
};

export default (props: GenericSwitcherProps) => (
  <AvailableProductsProvider
    isUserCentric={props.features.enableUserCentricProducts}
  >
    {(availableProducts: ProviderResult<AvailableProductsResponse>) => (
      <CommonDataProvider
        cloudId={props.cloudId}
        isUserCentric={Boolean(props.features.enableUserCentricProducts)}
      >
        {providerResults => {
          const switcherLinks = mapResultsToSwitcherProps(
            props.cloudId,
            providerResults,
            {
              ...props.features,
              ...getFeatures(props.product),
            },
            availableProducts,
          );

          return <Switcher {...props} {...switcherLinks} />;
        }}
      </CommonDataProvider>
    )}
  </AvailableProductsProvider>
);
