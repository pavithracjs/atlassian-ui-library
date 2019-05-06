import { ConfluenceRecentsMap, Result } from '../model/Result';
import ConfluenceClientImpl from './ConfluenceClient';

export default class CachingConfluenceClient extends ConfluenceClientImpl {
  prefetchedResults?: Promise<ConfluenceRecentsMap>;

  constructor(url: string, prefetchedResults?: Promise<ConfluenceRecentsMap>) {
    super(url);
    this.prefetchedResults = prefetchedResults;
  }

  async getRecentItems(searchSessionId: string): Promise<Result[]> {
    if (this.prefetchedResults) {
      return (await this.prefetchedResults).objects;
    }
    return super.getRecentItems(searchSessionId);
  }

  async getRecentSpaces(searchSessionId: string): Promise<Result[]> {
    if (this.prefetchedResults) {
      return (await this.prefetchedResults).spaces;
    }
    return super.getRecentSpaces(searchSessionId);
  }

  async searchPeopleInQuickNav(
    query: string,
    searchSessionId: string,
  ): Promise<Result[]> {
    if (this.prefetchedResults) {
      return (await this.prefetchedResults).people;
    }
    return super.searchPeopleInQuickNav(query, searchSessionId);
  }
}
