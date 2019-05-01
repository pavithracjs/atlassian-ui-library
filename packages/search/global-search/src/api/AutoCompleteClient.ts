import {
  RequestServiceOptions,
  ServiceConfig,
  utils,
} from '@atlaskit/util-service-support';

export interface AutoCompleteClient {
  getAutocomplete(query: string): Promise<string[]>;
}

export class AutoCompleteClientImpl implements AutoCompleteClient {
  private serviceConfig: ServiceConfig;
  private cloudId: string;
  /* Indicates the number of character difference for auto-correction */
  private AUTO_FIX: number = 1;

  constructor(url: string, cloudId: string) {
    this.serviceConfig = { url: url };
    this.cloudId = cloudId;
  }

  private createAutocompleteRequestPromise<T>(
    query: string,
  ): Promise<string[]> {
    const options: RequestServiceOptions = {
      queryParams: {
        cloudId: this.cloudId,
        autofix: this.AUTO_FIX,
        query,
      },
    };

    return utils.requestService(this.serviceConfig, options);
  }

  async getAutocomplete(query: string): Promise<string[]> {
    return this.createAutocompleteRequestPromise(query);
  }
}
