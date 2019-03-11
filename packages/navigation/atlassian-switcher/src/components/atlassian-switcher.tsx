import React from 'react';
import JiraSwitcher from './jira-switcher';
import ConfluenceSwitcher from './confluence-switcher';
import GenericSwitcher from './generic-switcher';
import ErrorBoundary from './error-boundary';
import { TriggerXFlowCallback, Product } from '../types';
import IntlProvider from './intl-provider';
import messages from '../utils/messages';

interface AtlassianSwitcherProps {
  product: string;
  cloudId: string;
  triggerXFlow: TriggerXFlowCallback;
}

const AtlassianSwitcher = (props: AtlassianSwitcherProps) => {
  const { product } = props;

  let Switcher: React.ReactType;
  switch (product) {
    case Product.JIRA:
      Switcher = JiraSwitcher;
      break;
    case Product.CONFLUENCE:
      Switcher = ConfluenceSwitcher;
      break;
    case Product.HOME:
    case Product.PEOPLE:
    case Product.SITE_ADMIN:
    case Product.TRUSTED_ADMIN:
      Switcher = GenericSwitcher;
      break;
    default:
      if (process.env.NODE_ENV !== 'production') {
        // tslint:disable-next-line:no-console
        console.warn(
          `Product key ${product} provided to Atlassian Switcher doesn't have a corresponding product specific implementation.`,
        );
      }
      return null;
  }
  return (
    <ErrorBoundary>
      <IntlProvider>
        <Switcher messages={messages} {...props} />
      </IntlProvider>
    </ErrorBoundary>
  );
};

export default AtlassianSwitcher;
