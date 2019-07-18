import * as api from './api';
import { getEnvironment } from '../utils/environments';
import { getStatus, getError } from '../state/actions/helpers';
import {
  JsonLd,
  CardClient as CardClientInterface,
  ClientEnvironment,
  EnvironmentsKeys,
  JsonLdBatch,
  JsonLdResponse,
} from './types';
import DataLoader from 'dataloader';

export type FetchErrorKind = 'fatal' | 'auth';
export class FetchError extends Error {
  public readonly kind: FetchErrorKind;
  constructor(kind: FetchErrorKind, message: string) {
    super(`${kind}: ${message}`);
    this.kind = kind;
    this.name = 'FetchError';
  }
}

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
    const { body, status: statusCode } = response;

    const status = getStatus(body);
    const errorType = getError(body);

    // Catch non-200 server responses to fallback or return useful information.
    if (status === 'not_found') {
      switch (errorType) {
        case 'ResolveAuthError':
          throw new FetchError(
            'auth',
            `authentication required for URL ${url}, error: ${errorType}`,
          );
        case 'InternalServerError': // Timeouts and ORS failures
        case 'ResolveUnsupportedError': // URL isn't supported
          throw new FetchError(
            'fatal',
            `the URL ${url} is unsupported, received server error: ${errorType}`,
          );
        default:
          return response.body;
        // NOTE: just return the response which is already a "not found"
        // fallback.
      }
    }

    if (statusCode === 404) {
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
