import { UIAnalyticsEvent } from '@atlaskit/analytics-next';

export interface TriggerXFlowCallback {
  (
    productKey: string,
    sourceComponent: string,
    event: any,
    analyticsEvent: UIAnalyticsEvent,
  ): void;
}
export interface DiscoverMoreCallback {
  (event: any, analyticsEvent: UIAnalyticsEvent): void;
}

export interface WithCloudId {
  cloudId: string;
}

export enum RecentContainerType {
  JIRA_PROJECT = 'jira-project',
  CONFLUENCE_SPACE = 'confluence-space',
}

export interface RecentContainer {
  name: string;
  url: string;
  objectId: string;
  iconUrl: string;
  type: RecentContainerType;
}

export interface CustomLink {
  key: string;
  label: string;
  link: string;
}

export enum Permissions {
  MANAGE = 'manage',
  CAN_INVITE_USERS = 'invite-users',
  ADD_PRODUCTS = 'add-products',
}

export enum Product {
  CONFLUENCE = 'confluence',
  HOME = 'home',
  JIRA = 'jira',
  PEOPLE = 'people',
  SITE_ADMIN = 'site-admin',
  TRUSTED_ADMIN = 'trusted-admin',
}

export enum Feature {
  enableUserCentricProducts = 'enableUserCentricProducts',
  disableCustomLinks = 'disableCustomLinks',
  disableRecentContainers = 'disableRecentContainers',
  disableHeadings = 'disableHeadings',
  xflow = 'xflow',
  isDiscoverMoreForEveryoneEnabled = 'isDiscoverMoreForEveryoneEnabled',
}

export enum MultiVariateFeature {
  productTopItemVariation = 'productTopItemVariation',
}

export enum ProductTopItemVariation {
  mostFrequentSite = 'most-frequent-site',
  currentSite = 'current-site',
}

export type FeatureFlagProps = {
  [key in Exclude<Feature, typeof Feature.xflow>]: boolean
} & {
  [MultiVariateFeature.productTopItemVariation]: ProductTopItemVariation;
};

export type FeatureMap = { [key in Feature]: boolean } & {
  [MultiVariateFeature.productTopItemVariation]: ProductTopItemVariation;
};

export type CustomLinksResponse = CustomLink[];

export interface ProductLicenseInformation {
  state: string;
  applicationUrl?: string;
}

export interface LicenseInformationResponse {
  hostname: string;
  products: {
    [key: string]: ProductLicenseInformation;
  };
}

export interface XFlowSettingsResponse {
  'product-suggestions-enabled'?: boolean;
}

export interface UserPermissionResponse {
  permitted: boolean;
}

export interface RecentContainersResponse {
  data: Array<RecentContainer>;
}

export enum WorklensProductType {
  JIRA_BUSINESS = 'JIRA_BUSINESS',
  JIRA_SERVICE_DESK = 'JIRA_SERVICE_DESK',
  JIRA_SOFTWARE = 'JIRA_SOFTWARE',
  CONFLUENCE = 'CONFLUENCE',
  OPSGENIE = 'OPSGENIE',
  BITBUCKET = 'BITBUCKET',
  STATUSPAGE = 'STATUSPAGE',
}

export type AvailableProduct =
  | {
      activityCount: number;
      productType:
        | WorklensProductType.JIRA_BUSINESS
        | WorklensProductType.JIRA_SERVICE_DESK
        | WorklensProductType.JIRA_SOFTWARE
        | WorklensProductType.CONFLUENCE;
    }
  | AvailableProductWithUrl;

interface AvailableProductWithUrl {
  activityCount: number;
  productType: WorklensProductType.BITBUCKET | WorklensProductType.OPSGENIE;
  url: string;
}

export interface AvailableSite {
  adminAccess: boolean;
  availableProducts: AvailableProduct[];
  avatar: string | null;
  cloudId: string;
  displayName: string;
  url: string;
}

export interface AvailableProductsResponse {
  sites: AvailableSite[];
}

export enum ProductKey {
  CONFLUENCE = 'confluence.ondemand',
  JIRA_CORE = 'jira-core.ondemand',
  JIRA_SOFTWARE = 'jira-software.ondemand',
  JIRA_SERVICE_DESK = 'jira-servicedesk.ondemand',
  JIRA_OPS = 'jira-incident-manager.ondemand',
  OPSGENIE = 'opsgenie',
}

export type RecommendationsEngineResponse = RecommendationItem[];

export interface RecommendationItem {
  productKey: ProductKey;
}

export type RecommendationsFeatureFlags = {
  [key: string]: string | boolean;
};

export interface SwitcherChildItem {
  href: string;
  label: string;
  avatar: string | null;
}
