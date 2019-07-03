import * as React from 'react';
import { ProviderResult } from './as-data-provider';

import { LicenseInformationResponse, RecentContainersResponse } from '../types';

import {
  LicenseInformationProvider,
  RecentContainersProvider,
  UserPermissionProvider,
  XFlowSettingsProvider,
} from './instance-data-providers';
import { Permissions } from '../types';

interface CommonDataProviderProps {
  cloudId: string;
  isUserCentric: boolean;
  children: (
    props: {
      recentContainers: ProviderResult<RecentContainersResponse>;
      licenseInformation: ProviderResult<LicenseInformationResponse>;
      managePermission: ProviderResult<boolean>;
      addProductsPermission: ProviderResult<boolean>;
      isXFlowEnabled: ProviderResult<boolean>;
    },
  ) => React.ReactElement<any>;
}

export default ({
  cloudId,
  children,
  isUserCentric,
}: CommonDataProviderProps) => {
  return (
    <RecentContainersProvider cloudId={cloudId}>
      {recentContainers => (
        <LicenseInformationProvider
          cloudId={cloudId}
          isUserCentric={isUserCentric}
        >
          {licenseInformation => (
            <UserPermissionProvider
              cloudId={cloudId}
              permissionId={Permissions.MANAGE}
            >
              {managePermission => (
                <UserPermissionProvider
                  cloudId={cloudId}
                  permissionId={Permissions.ADD_PRODUCTS}
                >
                  {addProductsPermission => (
                    <XFlowSettingsProvider cloudId={cloudId}>
                      {isXFlowEnabled =>
                        children({
                          recentContainers,
                          licenseInformation,
                          managePermission,
                          addProductsPermission,
                          isXFlowEnabled,
                        })
                      }
                    </XFlowSettingsProvider>
                  )}
                </UserPermissionProvider>
              )}
            </UserPermissionProvider>
          )}
        </LicenseInformationProvider>
      )}
    </RecentContainersProvider>
  );
};
