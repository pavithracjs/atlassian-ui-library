import * as React from 'react';

import { fetchJson } from '../utils/fetch';
import asDataProvider, {
  ProviderResult,
  ResultLoading,
  Status,
} from './as-data-provider';
import { AvailableProductsResponse } from '../types';
import { withCached } from '../utils/with-cached';

export const MANAGE_HREF = '/plugins/servlet/customize-application-navigator';

const fetchAvailableProducts = withCached((param: object) =>
  fetchJson<AvailableProductsResponse>(
    `/gateway/api/worklens/api/available-products`,
  ),
);

const RealDataProvider = asDataProvider(
  'availableProducts',
  fetchAvailableProducts,
  fetchAvailableProducts.cached,
);

const unresolvedAvailableProducts: ResultLoading = {
  status: Status.LOADING,
  data: null,
};

export const AvailableProductsProvider = ({
  isUserCentric,
  children,
}: {
  isUserCentric: boolean;
  children: (
    availableProducts: ProviderResult<AvailableProductsResponse>,
  ) => React.ReactNode;
}) => {
  if (isUserCentric) {
    return <RealDataProvider>{children}</RealDataProvider>;
  }
  // We should never be reading from this provider in non-user-centric mode, so here I model it as a provider that never resolves.
  return (
    <React.Fragment>{children(unresolvedAvailableProducts)}</React.Fragment>
  );
};

export const prefetchAvailableProducts = () => {
  fetchAvailableProducts({});
};

export const resetAvailableProducts = () => {
  fetchAvailableProducts.reset();
};
