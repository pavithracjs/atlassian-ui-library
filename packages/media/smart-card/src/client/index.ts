import * as api from './api';
import { getEnvironment } from '../utils/environments';
import {
  JsonLd,
  CardClient as CardClientInterface,
  ClientEnvironment,
  EnvironmentsKeys,
  JsonLdBatch,
  JsonLdResponse,
} from './types';
import DataLoader from 'dataloader';

export default class CardClient implements CardClientInterface {
  private environment: ClientEnvironment;
  private loadersByDomain: Record<string, DataLoader<string, JsonLdResponse>>;

  constructor(environment?: EnvironmentsKeys) {
    this.environment = getEnvironment(environment || 'prod');
    this.loadersByDomain = {};
  }

  private async batchResolve(resourceUrls: string[]): Promise<JsonLdBatch> {
    const { resolverUrl } = this.environment;
    const urls = resourceUrls.map(resourceUrl => ({ resourceUrl }));
    return await api.request<JsonLdBatch>(
      'post',
      `${resolverUrl}/resolve/batch`,
      urls,
    );
  }

  private createLoader() {
    return new DataLoader((urls: string[]) => this.batchResolve(urls), {
      maxBatchSize: 50,
    });
  }

  private getLoader(hostname: string) {
    if (!this.loadersByDomain[hostname]) {
      this.loadersByDomain[hostname] = this.createLoader();
    }
    return this.loadersByDomain[hostname];
  }

  public async fetchData(url: string): Promise<JsonLd> {
    const loader = this.getLoader(new URL(url).hostname);
    const response = await loader.load(url);
    if (response.status === 404) {
      return {
        meta: {
          visibility: 'not_found',
          access: 'forbidden',
          auth: [],
          definitionId: 'provider-not-found',
        },
        data: {
          url,
        },
      };
    }
    return response.body;
  }
}
