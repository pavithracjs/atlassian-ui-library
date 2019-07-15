import asDataProvider from './as-data-provider';
import { RecommendationsEngineResponse, ProductKey } from '../types';

// TODO: arguments for FF goes here, define FF rules here to display certain products in priority
function resolveRecommendations() {
  return [
    ProductKey.JIRA_SOFTWARE,
    ProductKey.CONFLUENCE,
    ProductKey.JIRA_SERVICE_DESK,
    ProductKey.OPSGENIE,
  ];
}
const fetchRecommendations = (): Promise<RecommendationsEngineResponse> =>
  Promise.resolve(resolveRecommendations());

export const RecommendationsEngineProvider = asDataProvider(
  'productRecommendations',
  fetchRecommendations,
);
