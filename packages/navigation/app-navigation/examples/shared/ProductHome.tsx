import {
  BitbucketIcon,
  BitbucketLogo,
  ConfluenceIcon,
  ConfluenceLogo,
  JiraIcon,
  JiraLogo,
  JiraServiceDeskIcon,
  JiraServiceDeskLogo,
  JiraSoftwareIcon,
  JiraSoftwareLogo,
  OpsGenieIcon,
  OpsGenieLogo,
} from '@atlaskit/logo';
import React from 'react';

import { CustomProductHome, ProductHome } from '../../src';

import atlassianIconUrl from './assets/atlassian-icon.png';
import atlassianLogoUrl from './assets/atlassian-logo.png';

export const BitbucketProductHome = () => (
  <ProductHome icon={BitbucketIcon} logo={BitbucketLogo} />
);

export const ConfluenceProductHome = () => (
  <ProductHome icon={ConfluenceIcon} logo={ConfluenceLogo} />
);

export const JiraProductHome = () => (
  <ProductHome icon={JiraIcon} logo={JiraLogo} />
);

export const JiraServiceDeskProductHome = () => (
  <ProductHome icon={JiraServiceDeskIcon} logo={JiraServiceDeskLogo} />
);

export const JiraSoftwareProductHome = () => (
  <ProductHome icon={JiraSoftwareIcon} logo={JiraSoftwareLogo} />
);

export const OpsGenieProductHome = () => (
  <ProductHome icon={OpsGenieIcon} logo={OpsGenieLogo} />
);

export const DefaultProductHome = JiraProductHome;

export const DefaultCustomProductHome = () => (
  <CustomProductHome
    iconAlt="Custom icon"
    iconUrl={atlassianIconUrl}
    logoAlt="Custom logo"
    logoUrl={atlassianLogoUrl}
  />
);
