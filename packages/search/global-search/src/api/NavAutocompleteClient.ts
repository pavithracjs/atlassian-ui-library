import {
  RequestServiceOptions,
  ServiceConfig,
  utils,
} from '@atlaskit/util-service-support';
import { Scope, NavScopeResult } from './types';

export interface NavAutocompleteClient {
  getNavAutocompleteSuggestions(query: string): Promise<string[]>;
}

export interface CrossProductSearchResponse {
  scopes: NavScopeResult[];
}

const NAV_AUTOCOMPLETE_PATH = 'quicksearch/v1';

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
    const path = NAV_AUTOCOMPLETE_PATH;
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

    const matchingScope: NavScopeResult | undefined = results.scopes.find(
<<<<<<< HEAD
      scope => scope.id === Scope.NavSearchComplete,
=======
      scope => scope.id == Scope.NavSearchComplete,
>>>>>>> XPSRCH-1697
    );

    const matchingDocuments = matchingScope ? matchingScope.results : [];

    return matchingDocuments.map(item => item.query);
  }

  async getNavAutocompleteSuggestions(query: string): Promise<string[]> {
    return this.createNavAutocompleteRequestPromise(query);
  }
}
