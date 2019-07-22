import {
  RequestServiceOptions,
  ServiceConfig,
  utils,
} from '@atlaskit/util-service-support';
import { Scope } from './types';

export interface NavAutocompleteClient {
  getNavAutocompleteSuggestions(query: string): Promise<string[]>;
}

export interface NavScopeResultItem {
  query: string;
}

export interface NavScopeResult {
  id: string;
  results: NavScopeResultItem[];
}

export interface CrossProductSearchResponse {
  scopes: NavScopeResult[];
}

export class NavAutocompleteClientImpl implements NavAutocompleteClient {
  private serviceConfig: ServiceConfig;
  private cloudId: string;

  constructor(url: string, cloudId: string) {
    this.serviceConfig = { url: url };
    this.cloudId = cloudId;
  }

  private async createNavAutocompleteRequestPromise<T>(
    query: string,
  ): Promise<string[]> {
    const path = 'quicksearch/v1';
    const options: RequestServiceOptions = {
      path,
      requestInit: {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cloudId: this.cloudId,
          scopes: [Scope.NavSearchComplete],
          query,
        }),
      },
    };
    return this.getNavAutocompleteQuery(options);
  }

  async getNavAutocompleteQuery(
    options: RequestServiceOptions,
  ): Promise<string[]> {
    const results: CrossProductSearchResponse = await utils.requestService<
      CrossProductSearchResponse
    >(this.serviceConfig, options);
    const matchingDocuments: NavScopeResult = results.scopes[0];

    return matchingDocuments.results.map(item => item.query);
  }

  async getNavAutocompleteSuggestions(query: string): Promise<string[]> {
    console.log('hits getNavautocompletionSugestions');
    return this.createNavAutocompleteRequestPromise(query);
  }
}
