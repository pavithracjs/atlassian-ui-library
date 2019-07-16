import asDataProvider from './as-data-provider';
import {
  RecommendationsEngineResponse,
  ProductKey,
  RecommendationItem,
} from '../types';

// TODO: arguments for FF goes here, define FF rules here to display certain products in priority
function resolveRecommendations(): RecommendationItem[] {
  return [
    { productKey: ProductKey.JIRA_SOFTWARE },
    { productKey: ProductKey.CONFLUENCE },
    { productKey: ProductKey.JIRA_SERVICE_DESK },
  ];
}
const fetchRecommendations = (): Promise<RecommendationsEngineResponse> =>
  Promise.resolve(resolveRecommendations());

export const RecommendationsEngineProvider = asDataProvider(
  'productRecommendations',
  fetchRecommendations,
);
