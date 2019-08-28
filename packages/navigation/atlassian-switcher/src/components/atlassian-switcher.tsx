import * as React from 'react';
import JiraSwitcher from './jira-switcher';
import ConfluenceSwitcher from './confluence-switcher';
import GenericSwitcher from './generic-switcher';
import ErrorBoundary from './error-boundary';
import {
  TriggerXFlowCallback,
  DiscoverMoreCallback,
  FeatureFlagProps,
  Product,
  RecommendationsFeatureFlags,
} from '../types';
import IntlProvider from './intl-provider';
import messages from '../utils/messages';
import {
  analyticsAttributes,
  NavigationAnalyticsContext,
  SWITCHER_COMPONENT,
  SWITCHER_SOURCE,
} from '../utils/analytics';
import packageContext from '../utils/package-context';
import mapPropsToFeatures from '../utils/map-props-to-features';
import { WithTheme } from '../theme/types';

type AtlassianSwitcherProps = WithTheme & {
  product: string;
  cloudId?: string;
  triggerXFlow?: TriggerXFlowCallback;
  onDiscoverMoreClicked?: DiscoverMoreCallback;
  recommendationsFeatureFlags?: RecommendationsFeatureFlags;
} & Partial<FeatureFlagProps>;

const getAnalyticsContext = (attributes: object) => ({
  source: SWITCHER_SOURCE,
  componentName: SWITCHER_COMPONENT,
  ...packageContext,
  ...analyticsAttributes(attributes),
});

const AtlassianSwitcher = (props: AtlassianSwitcherProps) => {
  const { product } = props;

  let Switcher: React.ElementType;
  switch (product) {
    case Product.JIRA:
      Switcher = JiraSwitcher;
      break;
    case Product.CONFLUENCE:
      Switcher = ConfluenceSwitcher;
      break;
    default:
      Switcher = GenericSwitcher;
  }

  const features = mapPropsToFeatures(props);

  return (
    <IntlProvider>
      <NavigationAnalyticsContext
        data={getAnalyticsContext({ featureFlags: features })}
      >
        <ErrorBoundary messages={messages}>
          <Switcher {...props} messages={messages} features={features} />
        </ErrorBoundary>
      </NavigationAnalyticsContext>
    </IntlProvider>
  );
};

export default AtlassianSwitcher;
