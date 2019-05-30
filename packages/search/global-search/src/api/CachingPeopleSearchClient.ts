import { Result } from '../model/Result';
import PeopleSearchClientImpl from './PeopleSearchClient';

export class CachingPeopleSearchClient extends PeopleSearchClientImpl {
  prefetchPeople: Promise<Result[]> | undefined;

  constructor(url: string, cloudId: string) {
    super(url, cloudId);
  }

  async getRecentPeople(): Promise<Result[]> {
    if (this.prefetchPeople) {
      return await this.prefetchPeople;
    }

    const prefetchedPeople = super.getRecentPeople();
    this.prefetchPeople = prefetchedPeople;
    return prefetchedPeople;
  }
}
