import { mapResultsToSwitcherProps } from '../../utils/map-results-to-switcher-props';
import {
  ResultLoading,
  Status,
  ResultComplete,
} from '../../providers/as-data-provider';
import {
  AvailableProductsResponse,
  AvailableSite,
  WorklensProductType,
  AvailableProduct,
} from '../../types';

describe('map-results-to-switcher-props', () => {
  describe('user-centric products', () => {
    it('displays the 5 most active products with an expand link', () => {
      const props = mapResultsToSwitcherProps(
        cloudId,
        loadingProvidersResult,
        {
          enableUserCentricProducts: true,
          disableCustomLinks: false,
          disableRecentContainers: false,
          xflow: false,
          isDiscoverMoreForEveryoneEnabled: false,
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
        },
        {
          description: 'site50',
          label: 'Jira Service Desk',
          href:
            'https://site50.atlassian.net/secure/BrowseProjects.jspa?selectedProjectType=service_desk',
        },
        {
          description: 'site40',
          label: 'Jira Core',
          href:
            'https://site40.atlassian.net/secure/BrowseProjects.jspa?selectedProjectType=business',
        },
        {
          description: 'site30',
          label: 'Jira Software',
          href:
            'https://site30.atlassian.net/secure/BrowseProjects.jspa?selectedProjectType=software',
        },
        {
          description: 'site20',
          label: 'Confluence',
          href: 'https://site20.atlassian.net/wiki',
        },
      ]);

      // Expand link is rendered when there are more items.
      expect(props.expandLink).toEqual(
        'https://start.atlassian.com?utm_source=switcher',
      );
    });

    it('displays the 5 most active products without an expand link', () => {
      const props = mapResultsToSwitcherProps(
        cloudId,
        loadingProvidersResult,
        {
          enableUserCentricProducts: true,
          disableCustomLinks: false,
          disableRecentContainers: false,
          xflow: false,
          isDiscoverMoreForEveryoneEnabled: false,
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
        { description: 'site50', label: 'Jira Service Desk' },
        { description: 'site40', label: 'Confluence' },
        { description: 'site30', label: 'Jira Core' },
        { description: 'site20', label: 'Opsgenie' },
        { description: 'bitbucket', label: 'Bitbucket' },
      ]);

      // Expand link is not rendered when the full list of products is displayed.
      expect(props.expandLink).toBeUndefined();
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
          isDiscoverMoreForEveryoneEnabled: false,
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
        },
        {
          description: 'bitbucket',
          label: 'Bitbucket',
          href: 'https://bitbucket.org',
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
    cloudId: siteName,
    displayName: siteName,
    url: `https://${siteName}.atlassian.net`,
  };
}

const cloudId = 'some-cloud-id';

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
