import {
  getAdministrationLinks,
  getCustomLinkItems,
  getFixedProductLinks,
  getLicensedProductLinks,
  getRecentLinkItems,
  getSuggestedProductLink,
  SwitcherItemType,
  getAvailableProductLinks,
} from './links';
import {
  isComplete,
  isError,
  ProviderResult,
  Status,
  hasLoaded,
} from '../providers/as-data-provider';
import {
  CustomLinksResponse,
  FeatureMap,
  LicenseInformationResponse,
  RecentContainersResponse,
  AvailableProductsResponse,
  ProductLicenseInformation,
  WorklensProductType,
  ProductKey,
  RecommendationsEngineResponse,
} from '../types';
import { createCollector } from './create-collector';

function collectAvailableProductLinks(
  cloudId: string | null | undefined,
  availableProducts?: ProviderResult<AvailableProductsResponse>,
  productTopItemVariation?: string,
): SwitcherItemType[] | undefined {
  if (availableProducts) {
    if (isError(availableProducts)) {
      return [];
    }
    if (isComplete(availableProducts)) {
      return getAvailableProductLinks(
        availableProducts.data,
        cloudId,
        productTopItemVariation,
      );
    }
    return;
  }
  return;
}

function collectProductLinks(
  licenseInformation: ProviderResults['licenseInformation'],
): SwitcherItemType[] | undefined {
  if (isError(licenseInformation)) {
    return [];
  }

  if (isComplete(licenseInformation)) {
    return getLicensedProductLinks(licenseInformation.data);
  }
}

function collectSuggestedLinks(
  licenseInformation: ProviderResults['licenseInformation'],
  productRecommendations: ProviderResults['productRecommendations'],
  isXFlowEnabled: ProviderResults['isXFlowEnabled'],
) {
  if (isError(isXFlowEnabled) || isError(licenseInformation)) {
    return [];
  }
  if (
    isComplete(licenseInformation) &&
    isComplete(isXFlowEnabled) &&
    isComplete(productRecommendations)
  ) {
    return isXFlowEnabled.data
      ? getSuggestedProductLink(
          licenseInformation.data,
          productRecommendations.data,
        )
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
  managePermission: ProviderResults['managePermission'],
  addProductsPermission: ProviderResults['addProductsPermission'],
  isDiscoverMoreForEveryoneEnabled: boolean,
) {
  if (isError(managePermission) || isError(addProductsPermission)) {
    return [];
  }

  if (isComplete(managePermission) && isComplete(addProductsPermission)) {
    if (managePermission.data || addProductsPermission.data) {
      return getAdministrationLinks(
        managePermission.data,
        isDiscoverMoreForEveryoneEnabled,
      );
    }

    return [];
  }
}

export function collectFixedProductLinks(
  isDiscoverMoreForEveryoneEnabled: boolean,
): SwitcherItemType[] {
  return getFixedProductLinks(isDiscoverMoreForEveryoneEnabled);
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
  productRecommendations: ProviderResult<RecommendationsEngineResponse>;
}

function asLegacyProductKey(
  worklensProductType: WorklensProductType,
): ProductKey | undefined {
  switch (worklensProductType) {
    case WorklensProductType.BITBUCKET:
      return undefined; // not used in legacy code
    case WorklensProductType.CONFLUENCE:
      return ProductKey.CONFLUENCE;
    case WorklensProductType.JIRA_BUSINESS:
      return ProductKey.JIRA_CORE;
    case WorklensProductType.JIRA_SERVICE_DESK:
      return ProductKey.JIRA_SERVICE_DESK;
    case WorklensProductType.JIRA_SOFTWARE:
      return ProductKey.JIRA_SOFTWARE;
    case WorklensProductType.OPSGENIE:
      return ProductKey.OPSGENIE;
    default:
      throw new Error(`unmapped worklensProductType ${worklensProductType}`);
  }
}

/** Convert the new AvailableProductsResponse to legacy LicenseInformationResponse type */
function asLicenseInformationProviderResult(
  availableProductsProvider: ProviderResult<AvailableProductsResponse>,
  cloudId: string,
): ProviderResult<LicenseInformationResponse> {
  switch (availableProductsProvider.status) {
    case Status.LOADING: // intentional fallthrough
    case Status.ERROR:
      return availableProductsProvider;
    case Status.COMPLETE:
      const site = availableProductsProvider.data.sites.find(
        site => site.cloudId === cloudId,
      );
      if (!site) {
        return {
          status: Status.ERROR,
          data: null,
          error: new Error(
            `could not find site in availableProducts for cloudId ${cloudId}`,
          ),
        };
      }
      return {
        status: Status.COMPLETE,
        data: {
          hostname: site.url,
          products: site.availableProducts.reduce(
            (acc: { [key: string]: ProductLicenseInformation }, product) => {
              const legacyProductKey = asLegacyProductKey(product.productType);
              if (legacyProductKey) {
                acc[legacyProductKey] = {
                  state: 'ACTIVE', // everything is ACTIVE
                  // applicationUrl: '', // not required
                  // billingPeriod: 'ANNUAL' // not required
                };
              }
              return acc;
            },
            {},
          ),
        },
      };
  }
}

export function mapResultsToSwitcherProps(
  cloudId: string | null | undefined,
  results: ProviderResults,
  features: FeatureMap,
  availableProducts: ProviderResult<AvailableProductsResponse>,
) {
  const collect = createCollector();

  const {
    licenseInformation,
    isXFlowEnabled,
    managePermission,
    addProductsPermission,
    customLinks,
    recentContainers,
    productRecommendations,
  } = results;
  if (isError(licenseInformation)) {
    throw licenseInformation.error;
  }
  const resolvedLicenseInformation: ProviderResult<LicenseInformationResponse> =
    features.enableUserCentricProducts && cloudId
      ? asLicenseInformationProviderResult(availableProducts, cloudId)
      : licenseInformation;

  const hasLoadedSiteCentricProducts = hasLoaded(licenseInformation);
  const hasLoadedAccountCentricProducts = hasLoaded(availableProducts);

  const hasLoadedLicenseInformation = features.enableUserCentricProducts
    ? hasLoadedAccountCentricProducts
    : hasLoadedSiteCentricProducts;
  const hasLoadedAdminLinks =
    hasLoaded(managePermission) && hasLoaded(addProductsPermission);
  const hasLoadedSuggestedProducts = features.xflow
    ? hasLoaded(productRecommendations) && hasLoaded(isXFlowEnabled)
    : true;

  return {
    licensedProductLinks: collect(
      features.enableUserCentricProducts
        ? collectAvailableProductLinks(
            cloudId,
            availableProducts,
            features.productTopItemVariation,
          )
        : collectProductLinks(licenseInformation),
      [],
    ),
    suggestedProductLinks: features.xflow
      ? collect(
          collectSuggestedLinks(
            resolvedLicenseInformation,
            productRecommendations,
            isXFlowEnabled,
          ),
          [],
        )
      : [],
    fixedLinks: collect(
      collectFixedProductLinks(features.isDiscoverMoreForEveryoneEnabled),
      [],
    ),
    adminLinks: collect(
      collectAdminLinks(
        managePermission,
        addProductsPermission,
        features.isDiscoverMoreForEveryoneEnabled,
      ),
      [],
    ),
    recentLinks: collect(
      collectRecentLinks(recentContainers, resolvedLicenseInformation),
      [],
    ),
    customLinks: collect(
      collectCustomLinks(customLinks, resolvedLicenseInformation),
      [],
    ),

    showManageLink: collect(collectCanManageLinks(managePermission), false),
    hasLoaded:
      hasLoadedLicenseInformation &&
      hasLoadedAdminLinks &&
      hasLoadedSuggestedProducts,
    hasLoadedCritical: hasLoadedLicenseInformation,
  };
}
