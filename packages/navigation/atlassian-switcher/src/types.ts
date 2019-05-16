import { UIAnalyticsEventInterface } from '@atlaskit/analytics-next';

export interface TriggerXFlowCallback {
  (
    productKey: string,
    sourceComponent: string,
    event: any,
    analyticsEvent: UIAnalyticsEventInterface,
  ): void;
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
  enableSplitJira = 'enableSplitJira',
  enableExpandLink = 'enableExpandLink',
}

export type FeatureFlagProps = { [key in Feature]: boolean };

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
