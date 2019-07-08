import {
  ABTest,
  CrossProductSearchClient,
  CrossProductSearchResults,
  EMPTY_CROSS_PRODUCT_SEARCH_RESPONSE,
  DEFAULT_AB_TEST,
} from '../../../api/CrossProductSearchClient';
import { Scope } from '../../../api/types';

export const noResultsCrossProductSearchClient: CrossProductSearchClient = {
  search(query: string) {
    return Promise.resolve(EMPTY_CROSS_PRODUCT_SEARCH_RESPONSE);
  },
  getAbTestDataForProduct() {
    return Promise.resolve(DEFAULT_AB_TEST);
  },
  getAbTestData(scope: Scope) {
    return Promise.resolve(DEFAULT_AB_TEST);
  },
  getPeople() {
    return Promise.resolve(EMPTY_CROSS_PRODUCT_SEARCH_RESPONSE);
  },
};

export const errorCrossProductSearchClient: CrossProductSearchClient = {
  search(query: string) {
    return Promise.reject('error');
  },
  getAbTestDataForProduct() {
    return Promise.reject('error');
  },
  getAbTestData(scope: Scope) {
    return Promise.reject('error');
  },
  getPeople() {
    return Promise.reject('error');
  },
};

export const mockCrossProductSearchClient = (
  data: CrossProductSearchResults,
  abTest: ABTest,
): CrossProductSearchClient => ({
  search(
    query: string,
    sessionId: string,
    scopes: Scope[],
  ): Promise<CrossProductSearchResults> {
    return Promise.resolve(data);
  },
  getAbTestDataForProduct() {
    return Promise.reject(abTest);
  },
  getAbTestData(scope: Scope): Promise<ABTest> {
    return Promise.resolve(abTest);
  },
  getPeople() {
    return Promise.resolve(data);
  },
});
