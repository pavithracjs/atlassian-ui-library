import { mapResultsToSwitcherProps } from '../../utils/map-results-to-switcher-props';
import {
  ResultLoading,
  Status,
  ResultComplete,
  ResultError,
} from '../../providers/as-data-provider';
import {
  AvailableProductsResponse,
  AvailableSite,
  WorklensProductType,
  AvailableProduct,
  ProductTopItemVariation,
  LicenseInformationResponse,
} from '../../types';

describe('map-results-to-switcher-props', () => {
  describe('hasLoaded flags', () => {
    it('account-centric hasLoadedCritical is set when license information has been loaded', () => {
      const props = mapResultsToSwitcherProps(
        null,
        loadingProvidersResult,
        {
          enableUserCentricProducts: true,
          disableCustomLinks: false,
          disableRecentContainers: false,
          isDiscoverMoreForEveryoneEnabled: false,
          productTopItemVariation: ProductTopItemVariation.currentSite,
          xflow: true,
          disableHeadings: false,
        },
        asCompletedProvider<AvailableProductsResponse>({ sites: [] }),
      );

      expect(props.hasLoadedCritical).toEqual(true);
      expect(props.hasLoaded).toEqual(false);
    });

    it('account-centric hasLoaded is set when license information + permissions + product recommendations have been loaded', () => {
      const props = mapResultsToSwitcherProps(
        null,
        {
          ...loadingProvidersResult,
          isXFlowEnabled: asCompletedProvider(true),
          managePermission: asCompletedProvider(true),
          addProductsPermission: asCompletedProvider(true),
          productRecommendations: asCompletedProvider([]),
        },
        {
          enableUserCentricProducts: true,
          disableCustomLinks: false,
          disableRecentContainers: false,
          isDiscoverMoreForEveryoneEnabled: false,
          xflow: true,
          productTopItemVariation: ProductTopItemVariation.currentSite,
          disableHeadings: false,
        },
        asCompletedProvider<AvailableProductsResponse>({ sites: [] }),
      );

      expect(props.hasLoadedCritical).toEqual(true);
      expect(props.hasLoaded).toEqual(true);
    });

    it('site-centric hasLoadedCritical is set when license information has been loaded', () => {
      const props = mapResultsToSwitcherProps(
        cloudId,
        {
          ...loadingProvidersResult,
          licenseInformation: asCompletedProvider<LicenseInformationResponse>({
            hostname: 'hostname',
            products: {},
          }),
        },
        {
          enableUserCentricProducts: false,
          disableCustomLinks: false,
          disableRecentContainers: false,
          isDiscoverMoreForEveryoneEnabled: false,
          productTopItemVariation: ProductTopItemVariation.currentSite,
          xflow: true,
          disableHeadings: false,
        },
        asCompletedProvider<AvailableProductsResponse>({ sites: [] }),
      );

      expect(props.hasLoadedCritical).toEqual(true);
      expect(props.hasLoaded).toEqual(false);
    });

    it('site-centric hasLoaded is set when license information + permissions + product recommendations have been loaded', () => {
      const props = mapResultsToSwitcherProps(
        cloudId,
        {
          ...loadingProvidersResult,
          licenseInformation: asCompletedProvider<LicenseInformationResponse>({
            hostname: 'hostname',
            products: {},
          }),
          isXFlowEnabled: asCompletedProvider(true),
          managePermission: asCompletedProvider(true),
          addProductsPermission: asCompletedProvider(true),
          productRecommendations: asCompletedProvider([]),
        },
        {
          enableUserCentricProducts: false,
          disableCustomLinks: false,
          disableRecentContainers: false,
          isDiscoverMoreForEveryoneEnabled: false,
          xflow: true,
          productTopItemVariation: ProductTopItemVariation.currentSite,
          disableHeadings: false,
        },
        asCompletedProvider<AvailableProductsResponse>({ sites: [] }),
      );

      expect(props.hasLoadedCritical).toEqual(true);
      expect(props.hasLoaded).toEqual(true);
    });

    it('hasLoaded is not blocked on failed request', () => {
      const props = mapResultsToSwitcherProps(
        cloudId,
        {
          ...loadingProvidersResult,
          isXFlowEnabled: asFailedProvider(),
          managePermission: asFailedProvider(),
          addProductsPermission: asFailedProvider(),
          productRecommendations: asFailedProvider(),
        },
        {
          enableUserCentricProducts: true,
          disableCustomLinks: false,
          disableRecentContainers: false,
          isDiscoverMoreForEveryoneEnabled: false,
          productTopItemVariation: ProductTopItemVariation.currentSite,
          xflow: true,
          disableHeadings: false,
        },
        asCompletedProvider<AvailableProductsResponse>({ sites: [] }),
      );

      expect(props.hasLoadedCritical).toEqual(true);
      expect(props.hasLoaded).toEqual(true);
    });

    it('xflow does not block hasLoaded if not enabled', () => {
      const props = mapResultsToSwitcherProps(
        cloudId,
        {
          ...loadingProvidersResult,
          managePermission: asCompletedProvider(true),
          addProductsPermission: asFailedProvider(),
        },
        {
          enableUserCentricProducts: true,
          disableCustomLinks: false,
          disableRecentContainers: false,
          isDiscoverMoreForEveryoneEnabled: false,
          productTopItemVariation: ProductTopItemVariation.currentSite,
          xflow: false,
          disableHeadings: false,
        },
        asCompletedProvider<AvailableProductsResponse>({ sites: [] }),
      );

      expect(props.hasLoadedCritical).toEqual(true);
      expect(props.hasLoaded).toEqual(true);
    });
  });

  describe('user-centric products', () => {
    it('displays the 5 most active products with an expand link', () => {
      const props = mapResultsToSwitcherProps(
        cloudId,
        loadingProvidersResult,
        {
          enableUserCentricProducts: true,
          disableCustomLinks: false,
          disableRecentContainers: false,
          productTopItemVariation: ProductTopItemVariation.currentSite,
          xflow: false,
          isDiscoverMoreForEveryoneEnabled: false,
          disableHeadings: false,
        },
        asCompletedProvider<AvailableProductsResponse>({
          sites: [
            generateSite('site50', [WorklensProductType.JIRA_SERVICE_DESK, 50]),
            generateSite('site60', [WorklensProductType.JIRA_SOFTWARE, 60]),
            generateSite('site40', [WorklensProductType.JIRA_BUSINESS, 40]),
            generateSite('site30', [WorklensProductType.JIRA_SOFTWARE, 30]),
            generateSite('site20', [WorklensProductType.CONFLUENCE, 20]),
            generateSite('site00', [WorklensProductType.JIRA_SOFTWARE, 0]),
            generateSite('site10', [WorklensProductType.JIRA_SOFTWARE, 10]),
          ],
        }),
      );

      expect(props.licensedProductLinks).toMatchObject([
        {
          description: 'site60',
          label: 'Jira Software',
          href:
            'https://site60.atlassian.net/secure/BrowseProjects.jspa?selectedProjectType=software',
          childItems: [
            {
              label: 'site00',
              href:
                'https://site00.atlassian.net/secure/BrowseProjects.jspa?selectedProjectType=software',
            },
            {
              label: 'site10',
              href:
                'https://site10.atlassian.net/secure/BrowseProjects.jspa?selectedProjectType=software',
            },

            {
              label: 'site30',
              href:
                'https://site30.atlassian.net/secure/BrowseProjects.jspa?selectedProjectType=software',
            },
            {
              label: 'site60',
              href:
                'https://site60.atlassian.net/secure/BrowseProjects.jspa?selectedProjectType=software',
            },
          ],
        },
        {
          description: 'site50',
          label: 'Jira Service Desk',
          href:
            'https://site50.atlassian.net/secure/BrowseProjects.jspa?selectedProjectType=service_desk',
          childItems: [],
        },
        {
          description: 'site40',
          label: 'Jira Core',
          href:
            'https://site40.atlassian.net/secure/BrowseProjects.jspa?selectedProjectType=business',
          childItems: [],
        },
        {
          description: 'site20',
          label: 'Confluence',
          href: 'https://site20.atlassian.net/wiki',
          childItems: [],
        },
      ]);
    });

    it('shows the most frequently used site at the top of the product if the variation is enabled', () => {
      const props = mapResultsToSwitcherProps(
        cloudId,
        loadingProvidersResult,
        {
          enableUserCentricProducts: true,
          disableCustomLinks: false,
          disableRecentContainers: false,
          productTopItemVariation: ProductTopItemVariation.mostFrequentSite,
          xflow: false,
          isDiscoverMoreForEveryoneEnabled: false,
          disableHeadings: false,
        },
        asCompletedProvider<AvailableProductsResponse>({
          sites: [
            generateSite('site60', [WorklensProductType.JIRA_SOFTWARE, 60]),
            generateSite('site30', [WorklensProductType.JIRA_SOFTWARE, 30]),
            generateSite('site10', [WorklensProductType.JIRA_SOFTWARE, 10]),
            generateSite(cloudId, [WorklensProductType.JIRA_SOFTWARE, 0]),
          ],
        }),
      );

      expect(props.licensedProductLinks).toMatchObject([
        {
          description: 'site60',
          label: 'Jira Software',
          href: `https://site60.atlassian.net/secure/BrowseProjects.jspa?selectedProjectType=software`,
          childItems: [
            {
              label: 'site10',
              href:
                'https://site10.atlassian.net/secure/BrowseProjects.jspa?selectedProjectType=software',
            },

            {
              label: 'site30',
              href:
                'https://site30.atlassian.net/secure/BrowseProjects.jspa?selectedProjectType=software',
            },
            {
              label: 'site60',
              href:
                'https://site60.atlassian.net/secure/BrowseProjects.jspa?selectedProjectType=software',
            },
            {
              label: cloudId,
              href: `https://${cloudId}.atlassian.net/secure/BrowseProjects.jspa?selectedProjectType=software`,
            },
          ],
        },
      ]);
    });

    it('shows the current site at the top of the product by default', () => {
      const props = mapResultsToSwitcherProps(
        cloudId,
        loadingProvidersResult,
        {
          enableUserCentricProducts: true,
          disableCustomLinks: false,
          disableRecentContainers: false,
          productTopItemVariation: ProductTopItemVariation.currentSite,
          xflow: false,
          isDiscoverMoreForEveryoneEnabled: false,
          disableHeadings: false,
        },
        asCompletedProvider<AvailableProductsResponse>({
          sites: [
            generateSite('site60', [WorklensProductType.JIRA_SOFTWARE, 60]),
            generateSite('site30', [WorklensProductType.JIRA_SOFTWARE, 30]),
            generateSite('site10', [WorklensProductType.JIRA_SOFTWARE, 10]),
            generateSite(cloudId, [WorklensProductType.JIRA_SOFTWARE, 0]),
          ],
        }),
      );

      expect(props.licensedProductLinks).toMatchObject([
        {
          description: cloudId,
          label: 'Jira Software',
          href: `https://${cloudId}.atlassian.net/secure/BrowseProjects.jspa?selectedProjectType=software`,
          childItems: [
            {
              label: 'site10',
              href:
                'https://site10.atlassian.net/secure/BrowseProjects.jspa?selectedProjectType=software',
            },

            {
              label: 'site30',
              href:
                'https://site30.atlassian.net/secure/BrowseProjects.jspa?selectedProjectType=software',
            },
            {
              label: 'site60',
              href:
                'https://site60.atlassian.net/secure/BrowseProjects.jspa?selectedProjectType=software',
            },
            {
              label: cloudId,
              href: `https://${cloudId}.atlassian.net/secure/BrowseProjects.jspa?selectedProjectType=software`,
            },
          ],
        },
      ]);
    });

    it('shows descriptions for products that belong to multiple sites', () => {
      const props = mapResultsToSwitcherProps(
        cloudId,
        loadingProvidersResult,
        {
          enableUserCentricProducts: true,
          disableCustomLinks: false,
          disableRecentContainers: false,
          productTopItemVariation: ProductTopItemVariation.currentSite,
          xflow: false,
          isDiscoverMoreForEveryoneEnabled: false,
          disableHeadings: false,
        },
        asCompletedProvider<AvailableProductsResponse>({
          sites: [
            generateSite('site50', [WorklensProductType.JIRA_SERVICE_DESK, 50]),
            generateSite('site30', [WorklensProductType.JIRA_BUSINESS, 30]),
            generateSite('site20', [WorklensProductType.OPSGENIE, 20]),
            generateSite('site40', [WorklensProductType.CONFLUENCE, 40]),
            generateSite('bitbucket', [WorklensProductType.BITBUCKET, 0]),
          ],
        }),
      );

      expect(props.licensedProductLinks).toMatchObject([
        { description: 'site50', label: 'Jira Service Desk', childItems: [] },
        { description: 'site30', label: 'Jira Core', childItems: [] },
        { description: 'site40', label: 'Confluence', childItems: [] },
        { description: 'site20', label: 'Opsgenie', childItems: [] },
        { label: 'Bitbucket', childItems: [] },
      ]);
    });

    it('does not show descriptions for products that belong to a single site', () => {
      const props = mapResultsToSwitcherProps(
        cloudId,
        loadingProvidersResult,
        {
          enableUserCentricProducts: true,
          isDiscoverMoreForEveryoneEnabled: false,
          disableCustomLinks: false,
          disableRecentContainers: false,
          productTopItemVariation: ProductTopItemVariation.currentSite,
          xflow: false,
          disableHeadings: false,
        },
        asCompletedProvider<AvailableProductsResponse>({
          sites: [
            generateSite('site10', [WorklensProductType.JIRA_SERVICE_DESK, 50]),
            generateSite('site10', [WorklensProductType.JIRA_BUSINESS, 30]),
            generateSite('site10', [WorklensProductType.CONFLUENCE, 40]),
            generateSite('bitbucket', [WorklensProductType.BITBUCKET, 0]),
          ],
        }),
      );

      expect(props.licensedProductLinks).toMatchObject([
        { label: 'Jira Service Desk', childItems: [] },
        { label: 'Jira Core', childItems: [] },
        { label: 'Confluence', childItems: [] },
        { label: 'Bitbucket', childItems: [] },
      ]);
    });

    it('renders opsgenie and bitbucket correctly', () => {
      const props = mapResultsToSwitcherProps(
        cloudId,
        loadingProvidersResult,
        {
          enableUserCentricProducts: true,
          disableCustomLinks: false,
          disableRecentContainers: false,
          xflow: false,
          productTopItemVariation: ProductTopItemVariation.currentSite,
          isDiscoverMoreForEveryoneEnabled: false,
          disableHeadings: false,
        },
        asCompletedProvider<AvailableProductsResponse>({
          sites: [
            generateSite(
              'opsgenie',
              [WorklensProductType.OPSGENIE, 0],
              'https://app.opsgenie.com',
            ),
            generateSite(
              'bitbucket',
              [WorklensProductType.BITBUCKET, 0],
              'https://bitbucket.org',
            ),
          ],
        }),
      );

      expect(props.licensedProductLinks).toMatchObject([
        {
          description: 'opsgenie',
          label: 'Opsgenie',
          href: 'https://app.opsgenie.com',
          childItems: [],
        },
        {
          label: 'Bitbucket',
          href: 'https://bitbucket.org',
          childItems: [],
        },
      ]);
    });
  });
});

function generateSite(
  siteName: string,
  productCounts: [WorklensProductType, number] = [
    WorklensProductType.JIRA_SOFTWARE,
    0,
  ],
  productUrl = '',
): AvailableSite {
  const availableProducts = [
    {
      productType: productCounts[0],
      activityCount: productCounts[1],
      url: productUrl,
    },
  ] as AvailableProduct[]; // assert the type here so we can use `url`
  return {
    adminAccess: false,
    availableProducts,
    avatar: null,
    cloudId: siteName,
    displayName: siteName,
    url: `https://${siteName}.atlassian.net`,
  };
}

const cloudId = 'some-cloud-id';

function asFailedProvider(): ResultError {
  return {
    status: Status.ERROR,
    error: 'error',
    data: null,
  };
}

function asCompletedProvider<T>(data: T): ResultComplete<T> {
  return {
    status: Status.COMPLETE,
    data,
  };
}

const loadingProviderResult: ResultLoading = {
  status: Status.LOADING,
  data: null,
};

const loadingProvidersResult = {
  customLinks: loadingProviderResult,
  recentContainers: loadingProviderResult,
  licenseInformation: loadingProviderResult,
  managePermission: loadingProviderResult,
  addProductsPermission: loadingProviderResult,
  isXFlowEnabled: loadingProviderResult,
  productRecommendations: loadingProviderResult,
};
