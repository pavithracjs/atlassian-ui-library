import { Result } from '../model/Result';
import PeopleSearchClientImpl from './PeopleSearchClient';

export class CachingPeopleSearchClient extends PeopleSearchClientImpl {
  prefetchPeople?: Promise<Result[]>;

  constructor(
    url: string,
    cloudId: string,
    prefetchedResults?: Promise<Result[]>,
  ) {
    super(url, cloudId);
    this.prefetchPeople = prefetchedResults;
  }

  async getRecentPeople(): Promise<Result[]> {
    if (this.prefetchPeople) {
      return await this.prefetchPeople;
    }
    return super.getRecentPeople();
  }
}
