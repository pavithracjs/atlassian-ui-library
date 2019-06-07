import * as React from 'react';
import { FormattedMessage as FormattedMessageNamespace } from 'react-intl';

import DiscoverFilledGlyph from '@atlaskit/icon/glyph/discover-filled';
import SettingsGlyph from '@atlaskit/icon/glyph/settings';

import {
  ConfluenceIcon,
  JiraIcon,
  JiraSoftwareIcon,
  JiraServiceDeskIcon,
  JiraCoreIcon,
} from '@atlaskit/logo';
import FormattedMessage from '../primitives/formatted-message';
import {
  LicenseInformationResponse,
  ProductLicenseInformation,
  RecentContainerType,
} from '../types';
import messages from './messages';
import JiraOpsLogo from './assets/jira-ops-logo';
import OpsgenieLogo from './assets/opsgenie-logo';
import PeopleLogo from './assets/people';
import { CustomLink, RecentContainer } from '../types';
import WorldIcon from '@atlaskit/icon/glyph/world';
import { createIcon, createImageIcon, IconType } from './icon-themes';

enum ProductActivationStatus {
  ACTIVE = 'ACTIVE',
  DEACTIVATED = 'DEACTIVATED',
}

export enum ProductKey {
  CONFLUENCE = 'confluence.ondemand',
  JIRA_CORE = 'jira-core.ondemand',
  JIRA_SOFTWARE = 'jira-software.ondemand',
  JIRA_SERVICE_DESK = 'jira-servicedesk.ondemand',
  JIRA_OPS = 'jira-incident-manager.ondemand',
  OPSGENIE = 'opsgenie',
}

const SINGLE_JIRA_PRODUCT: 'jira' = 'jira';

interface MessagesDict {
  [index: string]: FormattedMessageNamespace.MessageDescriptor;
}

export type SwitcherItemType = {
  key: string;
  label: React.ReactNode;
  Icon: IconType;
  href: string;
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
    Icon: createIcon(OpsgenieLogo, { size: 'small' }),
    href: 'https://app.opgsenie.com',
  },
};

export const getObjectTypeLabel = (type: string): React.ReactNode => {
  return OBJECT_TYPE_TO_LABEL_MAP[type] ? (
    <FormattedMessage {...OBJECT_TYPE_TO_LABEL_MAP[type]} />
  ) : (
    type
  );
};

export const getFixedProductLinks = (): SwitcherItemType[] => [
  {
    key: 'people',
    label: <FormattedMessage {...messages.people} />,
    Icon: createIcon(PeopleLogo, { size: 'small' }),
    href: `/people`,
  },
];

export const getProductLink = (
  productKey: ProductKey | typeof SINGLE_JIRA_PRODUCT,
  productLicenseInformation: ProductLicenseInformation,
): SwitcherItemType => {
  const productLinkProperties = PRODUCT_DATA_MAP[productKey];

  if (productKey === ProductKey.OPSGENIE) {
    // Prefer applicationUrl provided by license information (TCS)
    // Fallback to hard-coded URL
    const href = productLicenseInformation.applicationUrl
      ? productLicenseInformation.applicationUrl
      : productLinkProperties.href;

    return {
      key: productKey,
      ...productLinkProperties,
      href,
    };
  }

  return {
    key: productKey,
    ...PRODUCT_DATA_MAP[productKey],
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
): SwitcherItemType[] => {
  const adminBaseUrl = isAdmin ? `/admin` : '/trusted-admin';
  return [
    {
      key: 'discover-applications',
      label: <FormattedMessage {...messages.discoverMore} />,
      Icon: createIcon(DiscoverFilledGlyph, { size: 'medium' }),
      href: `${adminBaseUrl}/billing/addapplication`,
    },
    {
      key: 'administration',
      label: <FormattedMessage {...messages.administration} />,
      Icon: createIcon(SettingsGlyph, { size: 'medium' }),
      href: adminBaseUrl,
    },
  ];
};

export const getSuggestedProductLink = (
  licenseInformationData: LicenseInformationResponse,
): SwitcherItemType[] => {
  const productLinks = [];

  if (!getProductIsActive(licenseInformationData, ProductKey.CONFLUENCE)) {
    productLinks.push(
      getProductLink(
        ProductKey.CONFLUENCE,
        licenseInformationData.products[ProductKey.CONFLUENCE],
      ),
    );
  }
  if (
    !getProductIsActive(licenseInformationData, ProductKey.JIRA_SERVICE_DESK)
  ) {
    productLinks.push(
      getProductLink(
        ProductKey.JIRA_SERVICE_DESK,
        licenseInformationData.products[ProductKey.JIRA_SERVICE_DESK],
      ),
    );
  }

  return productLinks;
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
