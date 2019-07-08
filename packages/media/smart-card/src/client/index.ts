import * as api from './api';
import { getEnvironment } from '../utils/environments';
import {
  JsonLd,
  CardClient as CardClientInterface,
  ClientEnvironment,
  EnvironmentsKeys,
} from './types';

export default class CardClient implements CardClientInterface {
  private environment: ClientEnvironment;

  constructor(environment?: EnvironmentsKeys) {
    this.environment = getEnvironment(environment || 'prod');
  }

  private async fetch(resourceUrl: string): Promise<JsonLd> {
    const { resolverUrl } = this.environment;
    return await api.request('post', `${resolverUrl}/resolve`, { resourceUrl });
  }

  public async fetchData(url: string): Promise<JsonLd> {
    return await this.fetch(url);
  }
}
