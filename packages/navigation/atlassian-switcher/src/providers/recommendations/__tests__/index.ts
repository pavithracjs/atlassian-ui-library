import { ProductKey } from '../../../types';

import { resolveRecommendations } from '../index';
import { JSW_OG_EXPANDS_EXPERIMENT_FEATURE_FLAG_KEY } from '../constants';

describe('recommendations-provider-recommendations', () => {
  it('should return base recommendations if no feature flag provided', () => {
    expect(resolveRecommendations()).toEqual([
      { productKey: ProductKey.JIRA_SOFTWARE },
      { productKey: ProductKey.CONFLUENCE },
      { productKey: ProductKey.JIRA_SERVICE_DESK },
    ]);
  });

  it('should return base recommendations if no feature flag is matched', () => {
    expect(
      resolveRecommendations({ 'some-random-feature-flag': 'experiment' }),
    ).toEqual([
      { productKey: ProductKey.JIRA_SOFTWARE },
      { productKey: ProductKey.CONFLUENCE },
      { productKey: ProductKey.JIRA_SERVICE_DESK },
    ]);
  });

  it('should return jsw+og recommendations if feature flag is matched for variation', () => {
    expect(
      resolveRecommendations({
        [JSW_OG_EXPANDS_EXPERIMENT_FEATURE_FLAG_KEY]: 'variation1',
      }),
    ).toEqual([
      { productKey: ProductKey.JIRA_SOFTWARE },
      { productKey: ProductKey.CONFLUENCE },
      { productKey: ProductKey.JIRA_SERVICE_DESK },
      { productKey: ProductKey.OPSGENIE },
    ]);
  });

  it('should return base recommends even if jsw+ogis matched but requires experiment cohort', () => {
    expect(
      resolveRecommendations({
        [JSW_OG_EXPANDS_EXPERIMENT_FEATURE_FLAG_KEY]: 'control',
      }),
    ).toEqual([
      { productKey: ProductKey.JIRA_SOFTWARE },
      { productKey: ProductKey.CONFLUENCE },
      { productKey: ProductKey.JIRA_SERVICE_DESK },
    ]);
  });
});
