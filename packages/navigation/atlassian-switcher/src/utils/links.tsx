import * as React from 'react';
import { FormattedMessage as FormattedMessageNamespace } from 'react-intl';

import DiscoverFilledGlyph from '@atlaskit/icon/glyph/discover-filled';
import AddIcon from '@atlaskit/icon/glyph/add';
import SettingsGlyph from '@atlaskit/icon/glyph/settings';

import {
  BitbucketIcon,
  ConfluenceIcon,
  JiraIcon,
  JiraSoftwareIcon,
  JiraServiceDeskIcon,
  JiraCoreIcon,
  OpsGenieIcon,
  StatuspageIcon,
} from '@atlaskit/logo';
import FormattedMessage from '../primitives/formatted-message';
import {
  LicenseInformationResponse,
  ProductLicenseInformation,
  RecentContainerType,
  AvailableProductsResponse,
  AvailableProduct,
  WorklensProductType,
  ProductKey,
  RecommendationsEngineResponse,
  ProductTopItemVariation,
} from '../types';
import messages from './messages';
import JiraOpsLogo from './assets/jira-ops-logo';
import PeopleLogo from './assets/people';
import { CustomLink, RecentContainer, SwitcherChildItem } from '../types';
import WorldIcon from '@atlaskit/icon/glyph/world';
import { createIcon, createImageIcon, IconType } from './icon-themes';

enum ProductActivationStatus {
  ACTIVE = 'ACTIVE',
  DEACTIVATED = 'DEACTIVATED',
}

const SINGLE_JIRA_PRODUCT: 'jira' = 'jira';

interface MessagesDict {
  [index: string]: FormattedMessageNamespace.MessageDescriptor;
}

export type SwitcherItemType = {
  key: string;
  label: React.ReactNode;
  description?: React.ReactNode;
  Icon: IconType;
  href: string;
  childItems?: SwitcherChildItem[];
  productType?: WorklensProductType;
};

export type RecentItemType = SwitcherItemType & {
  type: string;
  description: React.ReactNode;
};

export const OBJECT_TYPE_TO_LABEL_MAP: MessagesDict = {
  'jira-project': messages.jiraProject,
  'confluence-space': messages.confluenceSpace,
};

export const PRODUCT_DATA_MAP: {
  [productKey in ProductKey | typeof SINGLE_JIRA_PRODUCT]: {
    label: string;
    Icon: React.ComponentType<any>;
    href: string;
  }
} = {
  [ProductKey.CONFLUENCE]: {
    label: 'Confluence',
    Icon: createIcon(ConfluenceIcon, { size: 'small' }),
    href: '/wiki',
  },
  [ProductKey.JIRA_CORE]: {
    label: 'Jira Core',
    Icon: createIcon(JiraCoreIcon, { size: 'small' }),
    href: '/secure/BrowseProjects.jspa?selectedProjectType=business',
  },
  [ProductKey.JIRA_SOFTWARE]: {
    label: 'Jira Software',
    Icon: createIcon(JiraSoftwareIcon, { size: 'small' }),
    href: '/secure/BrowseProjects.jspa?selectedProjectType=software',
  },
  [ProductKey.JIRA_SERVICE_DESK]: {
    label: 'Jira Service Desk',
    Icon: createIcon(JiraServiceDeskIcon, { size: 'small' }),
    href: '/secure/BrowseProjects.jspa?selectedProjectType=service_desk',
  },
  [ProductKey.JIRA_OPS]: {
    label: 'Jira Ops',
    Icon: createIcon(JiraOpsLogo, { size: 'small' }),
    href: '/secure/BrowseProjects.jspa?selectedProjectType=ops',
  },
  [SINGLE_JIRA_PRODUCT]: {
    label: 'Jira',
    Icon: createIcon(JiraIcon, { size: 'small' }),
    href: '/secure/MyJiraHome.jspa',
  },
  [ProductKey.OPSGENIE]: {
    label: 'Opsgenie',
    Icon: createIcon(OpsGenieIcon, { size: 'small' }),
    href: 'https://app.opsgenie.com',
  },
};

export const getObjectTypeLabel = (type: string): React.ReactNode => {
  return OBJECT_TYPE_TO_LABEL_MAP[type] ? (
    <FormattedMessage {...OBJECT_TYPE_TO_LABEL_MAP[type]} />
  ) : (
    type
  );
};

export const getFixedProductLinks = (
  isDiscoverMoreForEveryoneEnabled: boolean,
): SwitcherItemType[] => {
  const fixedLinks = [
    {
      key: 'people',
      label: <FormattedMessage {...messages.people} />,
      Icon: createIcon(PeopleLogo, { size: 'small' }),
      href: `/people`,
    },
  ];
  if (isDiscoverMoreForEveryoneEnabled) {
    // The discover more link href is intentionally empty to prioritise the onDiscoverMoreClicked callback
    fixedLinks.push({
      key: 'discover-more',
      label: <FormattedMessage {...messages.discoverMore} />,
      Icon: createIcon(AddIcon, { size: 'medium' }),
      href: '',
    });
  }

  return fixedLinks;
};

type AvailableProductDetails = Pick<
  SwitcherItemType,
  'label' | 'Icon' | 'href'
>;

export const AVAILABLE_PRODUCT_DATA_MAP: {
  [productKey in WorklensProductType]: AvailableProductDetails
} = {
  [WorklensProductType.BITBUCKET]: {
    label: 'Bitbucket',
    Icon: createIcon(BitbucketIcon, { size: 'small' }),
    href: '/wiki',
  },
  [WorklensProductType.CONFLUENCE]: {
    label: 'Confluence',
    Icon: createIcon(ConfluenceIcon, { size: 'small' }),
    href: '/wiki',
  },
  [WorklensProductType.JIRA_BUSINESS]: {
    label: 'Jira Core',
    Icon: createIcon(JiraCoreIcon, { size: 'small' }),
    href: '/secure/BrowseProjects.jspa?selectedProjectType=business',
  },
  [WorklensProductType.JIRA_SOFTWARE]: {
    label: 'Jira Software',
    Icon: createIcon(JiraSoftwareIcon, { size: 'small' }),
    href: '/secure/BrowseProjects.jspa?selectedProjectType=software',
  },
  [WorklensProductType.JIRA_SERVICE_DESK]: {
    label: 'Jira Service Desk',
    Icon: createIcon(JiraServiceDeskIcon, { size: 'small' }),
    href: '/secure/BrowseProjects.jspa?selectedProjectType=service_desk',
  },
  [WorklensProductType.OPSGENIE]: {
    label: 'Opsgenie',
    Icon: createIcon(OpsGenieIcon, { size: 'small' }),
    href: 'https://app.opsgenie.com',
  },
  [WorklensProductType.STATUSPAGE]: {
    label: 'Statuspage',
    Icon: createIcon(StatuspageIcon, { size: 'small' }),
    href: '#',
  },
};

const PRODUCT_ORDER = [
  WorklensProductType.JIRA_SOFTWARE,
  WorklensProductType.JIRA_SERVICE_DESK,
  WorklensProductType.JIRA_BUSINESS,
  WorklensProductType.CONFLUENCE,
  WorklensProductType.OPSGENIE,
  WorklensProductType.BITBUCKET,
  WorklensProductType.STATUSPAGE,
];

interface ConnectedSite {
  avatar: string | null;
  product: AvailableProduct;
  isCurrentSite: boolean;
  siteName: string;
  siteUrl: string;
}

const getProductSiteUrl = (connectedSite: ConnectedSite): string => {
  const { product, siteUrl } = connectedSite;

  if (
    product.productType === WorklensProductType.OPSGENIE ||
    product.productType === WorklensProductType.BITBUCKET
  ) {
    return product.url;
  }

  return siteUrl + AVAILABLE_PRODUCT_DATA_MAP[product.productType].href;
};

const getAvailableProductLinkFromSiteProduct = (
  connectedSites: ConnectedSite[],
  productTopItemVariation?: string,
): SwitcherItemType => {
  // if productTopItemVariation is 'most-frequent-site', we show most frequently visited site at the top
  const shouldEnableMostFrequentSortForTopItem =
    productTopItemVariation === ProductTopItemVariation.mostFrequentSite;

  const topSite =
    (!shouldEnableMostFrequentSortForTopItem &&
      connectedSites.find(site => site.isCurrentSite)) ||
    connectedSites.sort(
      (a, b) => b.product.activityCount - a.product.activityCount,
    )[0];
  const productType = topSite.product.productType;
  const productLinkProperties = AVAILABLE_PRODUCT_DATA_MAP[productType];

  return {
    ...productLinkProperties,
    key: productType + topSite.siteName,
    href: getProductSiteUrl(topSite),
    description: topSite.siteName,
    productType,
    childItems:
      connectedSites.length > 1
        ? connectedSites
            .map(site => ({
              href: getProductSiteUrl(site),
              label: site.siteName,
              avatar: site.avatar,
            }))
            .sort((a, b) => a.label.localeCompare(b.label))
        : [],
  };
};

export const getAvailableProductLinks = (
  availableProducts: AvailableProductsResponse,
  cloudId: string | null | undefined,
  productTopItemVariation?: string,
): SwitcherItemType[] => {
  const productsMap: { [key: string]: ConnectedSite[] } = {};

  availableProducts.sites.forEach(site => {
    const { availableProducts, avatar, displayName, url } = site;
    availableProducts.forEach(product => {
      const { productType } = product;

      if (!productsMap[productType]) {
        productsMap[productType] = [];
      }

      productsMap[productType].push({
        product,
        isCurrentSite: Boolean(cloudId) && site.cloudId === cloudId,
        siteName: displayName,
        siteUrl: url,
        avatar,
      });
    });
  });

  return PRODUCT_ORDER.map(productType => {
    const connectedSites = productsMap[productType];
    return (
      connectedSites &&
      getAvailableProductLinkFromSiteProduct(
        connectedSites,
        productTopItemVariation,
      )
    );
  }).filter(link => !!link);
};

export const getProductLink = (
  productKey: ProductKey | typeof SINGLE_JIRA_PRODUCT,
  productLicenseInformation?: ProductLicenseInformation,
): SwitcherItemType => {
  const productLinkProperties = PRODUCT_DATA_MAP[productKey];

  if (productKey === ProductKey.OPSGENIE && productLicenseInformation) {
    // Prefer applicationUrl provided by license information (TCS)
    // Fallback to hard-coded URL
    const href = productLicenseInformation.applicationUrl
      ? productLicenseInformation.applicationUrl
      : productLinkProperties.href;

    return { key: productKey, ...productLinkProperties, href };
  }

  return {
    key: productKey,
    ...productLinkProperties,
  };
};

export const getProductIsActive = (
  { products }: LicenseInformationResponse,
  productKey: string,
): boolean =>
  products.hasOwnProperty(productKey) &&
  products[productKey].state === ProductActivationStatus.ACTIVE;

// This function will determine which product links to render based
// on license information and if we're separating the jira products or not
export const getLicensedProductLinks = (
  licenseInformationData: LicenseInformationResponse,
): SwitcherItemType[] => {
  const majorJiraProducts = [
    ProductKey.JIRA_SOFTWARE,
    ProductKey.JIRA_SERVICE_DESK,
    ProductKey.JIRA_OPS,
  ].filter(productKey =>
    getProductIsActive(licenseInformationData, productKey),
  );
  const minorJiraProducts = [ProductKey.JIRA_CORE].filter(productKey =>
    getProductIsActive(licenseInformationData, productKey),
  );

  const jiraProducts = [...majorJiraProducts, ...minorJiraProducts];
  const otherProducts = [ProductKey.CONFLUENCE, ProductKey.OPSGENIE].filter(
    productKey => getProductIsActive(licenseInformationData, productKey),
  );

  return [...jiraProducts, ...otherProducts].map(productKey =>
    getProductLink(productKey, licenseInformationData.products[productKey]),
  );
};

export const getAdministrationLinks = (
  isAdmin: boolean,
  isDiscoverMoreForEveryoneEnabled: boolean,
): SwitcherItemType[] => {
  const adminBaseUrl = isAdmin ? `/admin` : '/trusted-admin';
  const adminLinks = [
    {
      key: 'administration',
      label: <FormattedMessage {...messages.administration} />,
      Icon: createIcon(SettingsGlyph, { size: 'medium' }),
      href: adminBaseUrl,
    },
  ];
  if (!isDiscoverMoreForEveryoneEnabled) {
    adminLinks.unshift({
      key: 'discover-applications',
      label: <FormattedMessage {...messages.discoverMore} />,
      Icon: createIcon(DiscoverFilledGlyph, { size: 'medium' }),
      href: `${adminBaseUrl}/billing/addapplication`,
    });
  }
  return adminLinks;
};

const PRODUCT_RECOMMENDATION_LIMIT = 2;

export const getSuggestedProductLink = (
  licenseInformationData: LicenseInformationResponse,
  productRecommendations: RecommendationsEngineResponse,
): SwitcherItemType[] => {
  const filteredProducts = productRecommendations.filter(
    product => !getProductIsActive(licenseInformationData, product.productKey),
  );
  return filteredProducts
    .slice(0, PRODUCT_RECOMMENDATION_LIMIT)
    .map(product => getProductLink(product.productKey));
};

export const getCustomLinkItems = (
  list: Array<CustomLink>,
  licenseInformationData: LicenseInformationResponse,
): SwitcherItemType[] => {
  const defaultProductCustomLinks = [
    `${licenseInformationData.hostname}/secure/MyJiraHome.jspa`,
    `${licenseInformationData.hostname}/wiki/`,
  ];
  return list
    .filter(
      customLink => defaultProductCustomLinks.indexOf(customLink.link) === -1,
    )
    .map(customLink => ({
      key: customLink.key,
      label: customLink.label,
      Icon: createIcon(WorldIcon),
      href: customLink.link,
    }));
};

export const getRecentLinkItems = (
  list: Array<RecentContainer>,
  licenseInformationData: LicenseInformationResponse,
): RecentItemType[] => {
  const isAnyJiraProductActive =
    getProductIsActive(licenseInformationData, ProductKey.JIRA_SOFTWARE) ||
    getProductIsActive(licenseInformationData, ProductKey.JIRA_SERVICE_DESK) ||
    getProductIsActive(licenseInformationData, ProductKey.JIRA_CORE) ||
    getProductIsActive(licenseInformationData, ProductKey.JIRA_OPS);
  const isConfluenceActive = getProductIsActive(
    licenseInformationData,
    ProductKey.CONFLUENCE,
  );
  return list
    .filter((recent: RecentContainer) => {
      return (
        (recent.type === RecentContainerType.JIRA_PROJECT &&
          isAnyJiraProductActive) ||
        (recent.type === RecentContainerType.CONFLUENCE_SPACE &&
          isConfluenceActive) ||
        [
          RecentContainerType.JIRA_PROJECT,
          RecentContainerType.CONFLUENCE_SPACE,
        ].indexOf(recent.type) === -1
      );
    })
    .slice(0, 6)
    .map(customLink => ({
      key: customLink.objectId,
      label: customLink.name,
      Icon: createImageIcon(customLink.iconUrl),
      href: customLink.url,
      type: customLink.type,
      description: getObjectTypeLabel(customLink.type),
    }));
};
