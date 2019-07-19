import asDataProvider from './as-data-provider';
import {
  RecommendationsEngineResponse,
  RecommendationFeatureFlags,
} from '../types';

import { resolveRecommendations } from './recommendations';

const fetchRecommendations = ({
  featureFlags,
}: {
  featureFlags?: RecommendationFeatureFlags;
}): Promise<RecommendationsEngineResponse> =>
  Promise.resolve(resolveRecommendations(featureFlags));

export const RecommendationsEngineProvider = asDataProvider(
  'productRecommendations',
  fetchRecommendations,
);
