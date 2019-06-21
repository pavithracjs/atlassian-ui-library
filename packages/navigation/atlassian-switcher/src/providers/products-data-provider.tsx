import * as React from 'react';

import { fetchJson } from '../utils/fetch';
import asDataProvider, {
  ProviderResult,
  ResultLoading,
  Status,
} from './as-data-provider';
import { AvailableProductsResponse } from '../types';

export const MANAGE_HREF = '/plugins/servlet/customize-application-navigator';

const fetchAvailableProducts = () =>
  fetchJson<AvailableProductsResponse>(
    `/gateway/api/worklens/api/available-products`,
  );

const RealDataProvider = asDataProvider(
  'availableProducts',
  fetchAvailableProducts,
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
  return (
    <React.Fragment>{children(unresolvedAvailableProducts)}</React.Fragment>
  );
};
