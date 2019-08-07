import * as React from 'react';
import { ProviderResult } from './as-data-provider';

import { LicenseInformationResponse, RecentContainersResponse } from '../types';

import {
  LicenseInformationProvider,
  RecentContainersProvider,
  UserPermissionProvider,
  XFlowSettingsProvider,
} from './instance-data-providers';
import { RecommendationsEngineProvider } from './recommendations-provider';
import {
  Permissions,
  RecommendationsEngineResponse,
  RecommendationsFeatureFlags,
} from '../types';

interface CommonDataProviderProps {
  cloudId?: string;
  isUserCentric: boolean;
  disableRecentContainers: boolean;
  recommendationsFeatureFlags?: RecommendationsFeatureFlags;
  children: (
    props: {
      recentContainers: ProviderResult<RecentContainersResponse>;
      licenseInformation: ProviderResult<LicenseInformationResponse>;
      managePermission: ProviderResult<boolean>;
      addProductsPermission: ProviderResult<boolean>;
      isXFlowEnabled: ProviderResult<boolean>;
      productRecommendations: ProviderResult<RecommendationsEngineResponse>;
    },
  ) => React.ReactElement<any>;
}

export default ({
  cloudId,
  children,
  isUserCentric,
  recommendationsFeatureFlags,
  disableRecentContainers,
}: CommonDataProviderProps) => {
  return (
    <RecentContainersProvider
      cloudId={cloudId}
      disableRecentContainers={disableRecentContainers}
    >
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
                      {isXFlowEnabled => (
                        <RecommendationsEngineProvider
                          featureFlags={recommendationsFeatureFlags}
                        >
                          {productRecommendations =>
                            children({
                              recentContainers,
                              licenseInformation,
                              managePermission,
                              addProductsPermission,
                              isXFlowEnabled,
                              productRecommendations,
                            })
                          }
                        </RecommendationsEngineProvider>
                      )}
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
