import React from 'react';

import { fetchJson, postJson } from '../utils/fetch';
import asDataProvider, {
  ProviderResult,
  Status,
  ResultLoading,
} from './as-data-provider';
import {
  LicenseInformationResponse,
  Permissions,
  RecentContainersResponse,
  UserPermissionResponse,
  WithCloudId,
  XFlowSettingsResponse,
} from '../types';
import { withCached } from '../utils/with-cached';

// Recent activity api
const fetchRecentContainers = ({ cloudId }: WithCloudId) =>
  fetchJson<RecentContainersResponse>(
    `/gateway/api/activity/api/client/recent/containers?cloudId=${cloudId}`,
  );

export const RecentContainersProvider = asDataProvider(
  'recentContainers',
  fetchRecentContainers,
);

// License information api
const fetchLicenseInformation = withCached(({ cloudId }: WithCloudId) =>
  fetchJson<LicenseInformationResponse>(
    `/gateway/api/xflow/${cloudId}/license-information`,
  ),
);

const RealLicenseInformationProvider = asDataProvider(
  'licenseInformation',
  fetchLicenseInformation,
  fetchLicenseInformation.cached,
);

const unresolvedLicenseInformation: ResultLoading = {
  status: Status.LOADING,
  data: null,
};

export const LicenseInformationProvider = ({
  cloudId,
  isUserCentric,
  children,
}: {
  cloudId: string;
  isUserCentric: boolean;
  children: (
    licenseInformation: ProviderResult<LicenseInformationResponse>,
  ) => React.ReactNode;
}) => {
  if (!isUserCentric) {
    return (
      <RealLicenseInformationProvider cloudId={cloudId}>
        {children}
      </RealLicenseInformationProvider>
    );
  }
  return (
    <React.Fragment>{children(unresolvedLicenseInformation)}</React.Fragment>
  );
};

// Permissions api
type FetchPermissionParamsType = WithCloudId & {
  permissionId: Permissions;
};
const fetchPermission = withCached(
  ({ cloudId, permissionId }: FetchPermissionParamsType) =>
    postJson<UserPermissionResponse>(`/gateway/api/permissions/permitted`, {
      permissionId,
      resourceId: `ari:cloud:platform::site/${cloudId}`,
    }).then(permission => permission.permitted),
);

export const UserPermissionProvider = asDataProvider(
  'permission',
  fetchPermission,
  fetchPermission.cached,
);

// Xflow settings api
const fetchXflowSettings = withCached(({ cloudId }: WithCloudId) =>
  fetchJson<XFlowSettingsResponse>(
    `/gateway/api/site/${cloudId}/setting/xflow`,
  ).then(xFlowSettings =>
    xFlowSettings['product-suggestions-enabled'] !== undefined
      ? xFlowSettings['product-suggestions-enabled']
      : true,
  ),
);

export const XFlowSettingsProvider = asDataProvider(
  'xflowSettings',
  fetchXflowSettings,
  fetchXflowSettings.cached,
);

export const prefetchAll = ({ cloudId }: WithCloudId) => {
  fetchLicenseInformation({ cloudId });
  fetchXflowSettings({ cloudId });
  fetchPermission({
    cloudId,
    permissionId: Permissions.ADD_PRODUCTS,
  });
  fetchPermission({ cloudId, permissionId: Permissions.MANAGE });
};

export const resetAll = () => {
  fetchLicenseInformation.reset();
  fetchXflowSettings.reset();
  fetchPermission.reset();
};
