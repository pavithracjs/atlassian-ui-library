import asDataProvider from './as-data-provider';
import {
  RecommendationsEngineResponse,
  RecommendationFeatureFlags,
} from '../types';

import { resolveRecommendations } from './recommendations';

const fetchRecommendations = ({
  recommendationsFeatureFlags,
}: {
  recommendationsFeatureFlags?: RecommendationFeatureFlags;
}): Promise<RecommendationsEngineResponse> =>
  Promise.resolve(resolveRecommendations(recommendationsFeatureFlags));

export const RecommendationsEngineProvider = asDataProvider(
  'productRecommendations',
  fetchRecommendations,
);
