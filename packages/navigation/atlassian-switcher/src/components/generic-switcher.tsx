import * as React from 'react';
import { Messages } from 'react-intl';
import Switcher from './switcher';
import CommonDataProvider from '../providers/common-data-provider';
import { Product, FeatureMap } from '../types';
import { mapResultsToSwitcherProps } from '../utils/map-results-to-switcher-props';
import { AvailableProductsProvider } from '../providers/products-data-provider';

type GenericSwitcherProps = {
  cloudId: string;
  messages: Messages;
  features: FeatureMap;
  triggerXFlow: (productKey: string, sourceComponent: string) => void;
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
      >
        {providerResults => {
          const switcherLinks = mapResultsToSwitcherProps(
            props.cloudId,
            providerResults,
            props.features,
            availableProducts,
            props.product,
          );

          return <Switcher {...props} {...switcherLinks} />;
        }}
      </CommonDataProvider>
    )}
  </AvailableProductsProvider>
);
