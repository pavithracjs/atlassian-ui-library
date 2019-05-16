import {
  getAdministrationLinks,
  getCustomLinkItems,
  getFixedProductLinks,
  getLicensedProductLinks,
  getRecentLinkItems,
  getSuggestedProductLink,
} from './links';
import {
  isComplete,
  isError,
  isLoading,
  ProviderResult,
} from '../providers/as-data-provider';
import {
  CustomLinksResponse,
  LicenseInformationResponse,
  RecentContainersResponse,
} from '../types';
import { createCollector } from './create-collector';

function getExpandLink(
  licenseInformation: ProviderResults['licenseInformation'],
) {
  if (licenseInformation === undefined || isError(licenseInformation)) {
    return '//start.atlassian.com';
  }
  if (isComplete(licenseInformation)) {
    const isStagingInstance =
      licenseInformation.data.hostname.indexOf('.jira-dev.com') !== -1;
    return `//start.${isStagingInstance ? 'stg.' : ''}atlassian.com`;
  }
}

function collectProductLinks(
  cloudId: string,
  licenseInformation: ProviderResults['licenseInformation'],
  enableSplitJira: boolean,
) {
  if (isError(licenseInformation)) {
    return [];
  }

  if (isComplete(licenseInformation)) {
    return getLicensedProductLinks(licenseInformation.data, enableSplitJira);
  }
}

function collectSuggestedLinks(
  licenseInformation: ProviderResults['licenseInformation'],
  isXFlowEnabled: ProviderResults['isXFlowEnabled'],
) {
  if (isError(isXFlowEnabled) || isError(licenseInformation)) {
    return [];
  }

  if (isComplete(licenseInformation) && isComplete(isXFlowEnabled)) {
    return isXFlowEnabled.data
      ? getSuggestedProductLink(licenseInformation.data)
      : [];
  }
}

function collectCanManageLinks(
  managePermission: ProviderResults['managePermission'],
) {
  if (isComplete(managePermission)) {
    return managePermission.data;
  }
}

function collectAdminLinks(
  cloudId: string,
  managePermission: ProviderResults['managePermission'],
  addProductsPermission: ProviderResults['addProductsPermission'],
) {
  if (isError(managePermission) || isError(addProductsPermission)) {
    return [];
  }

  if (isComplete(managePermission) && isComplete(addProductsPermission)) {
    if (managePermission.data || addProductsPermission.data) {
      return getAdministrationLinks(managePermission.data);
    }

    return [];
  }
}

export function collectFixedProductLinks() {
  return getFixedProductLinks();
}

function collectRecentLinks(
  recentContainers: ProviderResults['recentContainers'],
  licenseInformation: ProviderResults['licenseInformation'],
) {
  if (isError(recentContainers) || isError(licenseInformation)) {
    return [];
  }

  if (isComplete(recentContainers) && isComplete(licenseInformation)) {
    return getRecentLinkItems(
      recentContainers.data.data,
      licenseInformation.data,
    );
  }
}

function collectCustomLinks(
  customLinks: ProviderResults['customLinks'],
  licenseInformation: ProviderResults['licenseInformation'],
) {
  if (customLinks === undefined || isError(customLinks)) {
    return [];
  }

  if (isComplete(customLinks) && isComplete(licenseInformation)) {
    return getCustomLinkItems(customLinks.data, licenseInformation.data);
  }
}

interface ProviderResults {
  customLinks?: ProviderResult<CustomLinksResponse>;
  recentContainers: ProviderResult<RecentContainersResponse>;
  licenseInformation: ProviderResult<LicenseInformationResponse>;
  managePermission: ProviderResult<boolean>;
  addProductsPermission: ProviderResult<boolean>;
  isXFlowEnabled: ProviderResult<boolean>;
}

interface SwitcherFeatures {
  xflow: boolean;
  enableSplitJira: boolean;
  enableExpandLink: boolean;
}

export function mapResultsToSwitcherProps(
  cloudId: string,
  results: ProviderResults,
  features: SwitcherFeatures,
) {
  const collect = createCollector();

  const {
    licenseInformation,
    isXFlowEnabled,
    managePermission,
    addProductsPermission,
    customLinks,
    recentContainers,
  } = results;

  if (isError(licenseInformation)) {
    throw licenseInformation.error;
  }

  return {
    expandLink: features.enableExpandLink
      ? getExpandLink(licenseInformation)
      : '',
    licensedProductLinks: collect(
      collectProductLinks(
        cloudId,
        licenseInformation,
        features.enableSplitJira,
      ),
      [],
    ),
    suggestedProductLinks: features.xflow
      ? collect(collectSuggestedLinks(licenseInformation, isXFlowEnabled), [])
      : [],
    fixedLinks: collect(collectFixedProductLinks(), []),
    adminLinks: collect(
      collectAdminLinks(cloudId, managePermission, addProductsPermission),
      [],
    ),
    recentLinks: collect(
      collectRecentLinks(recentContainers, licenseInformation),
      [],
    ),
    customLinks: collect(
      collectCustomLinks(customLinks, licenseInformation),
      [],
    ),

    showManageLink: collect(collectCanManageLinks(managePermission), false),
    isLoading: isLoading(licenseInformation),
  };
}
