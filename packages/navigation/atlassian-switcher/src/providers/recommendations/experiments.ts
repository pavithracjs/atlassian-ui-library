import { ProductKey, RecommendationItem } from '../../types';

import {
  JSW_OG_EXPANDS_EXPERIMENT_FEATURE_FLAG_KEY,
  JSW_OG_EXPANDS_EXPERIMENT_VARIATIONS,
} from './constants';

function showFeatureFlagVariation(featureFlagValue: string | boolean): boolean {
  if (typeof featureFlagValue !== 'string') {
    return false;
  }

  if (JSW_OG_EXPANDS_EXPERIMENT_VARIATIONS.includes(featureFlagValue)) {
    return true;
  }

  return false;
}

function jswOgRecommendation(): RecommendationItem[] {
  return [
    { productKey: ProductKey.JIRA_SOFTWARE },
    { productKey: ProductKey.CONFLUENCE },
    { productKey: ProductKey.JIRA_SERVICE_DESK },
    { productKey: ProductKey.OPSGENIE },
  ];
}

export const jswOgExpandsExperiment = {
  flagKey: JSW_OG_EXPANDS_EXPERIMENT_FEATURE_FLAG_KEY,
  variationValues: JSW_OG_EXPANDS_EXPERIMENT_FEATURE_FLAG_KEY,
  recommendations: jswOgRecommendation,
  showFeatureFlagVariation: showFeatureFlagVariation,
};
