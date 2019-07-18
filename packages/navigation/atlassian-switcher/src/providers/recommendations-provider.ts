import asDataProvider from './as-data-provider';
import {
  RecommendationsEngineResponse,
  RecommendationFeatureFlags,
} from '../types';

import { resolveRecommendations } from './recommendations';

const fetchRecommendations = ({
  recommendationFeatureFlags,
}: {
  recommendationFeatureFlags?: RecommendationFeatureFlags;
}): Promise<RecommendationsEngineResponse> =>
  Promise.resolve(resolveRecommendations(recommendationFeatureFlags));

export const RecommendationsEngineProvider = asDataProvider(
  'productRecommendations',
  fetchRecommendations,
);
