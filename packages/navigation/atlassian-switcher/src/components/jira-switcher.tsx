import * as React from 'react';
import { Messages } from 'react-intl';
import Switcher from './switcher';
import {
  CustomLinksProvider,
  MANAGE_HREF,
} from '../providers/jira-data-providers';
import CommonDataProvider from '../providers/common-data-provider';
import { mapResultsToSwitcherProps } from '../utils/map-results-to-switcher-props';
import { FeatureFlagProps } from '../types';

type JiraSwitcherProps = {
  cloudId: string;
  messages: Messages;
  features: FeatureFlagProps;
  triggerXFlow: (productKey: string, sourceComponent: string) => void;
};

export default (props: JiraSwitcherProps) => (
  <CustomLinksProvider>
    {customLinks => (
      <CommonDataProvider cloudId={props.cloudId}>
        {providerResults => {
          const {
            showManageLink,
            ...switcherLinks
          } = mapResultsToSwitcherProps(
            props.cloudId,
            { customLinks, ...providerResults },
            { ...props.features, xflow: true },
          );

          return (
            <Switcher
              {...props}
              {...switcherLinks}
              manageLink={showManageLink ? MANAGE_HREF : undefined}
            />
          );
        }}
      </CommonDataProvider>
    )}
  </CustomLinksProvider>
);
