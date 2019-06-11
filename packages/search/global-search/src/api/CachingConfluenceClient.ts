import {
  ConfluenceRecentsMap,
  Result,
  ConfluenceObjectResult,
  PersonResult,
} from '../model/Result';
import ConfluenceClientImpl from './ConfluenceClient';

export default class CachingConfluenceClient extends ConfluenceClientImpl {
  prefetchedResults?: Promise<ConfluenceRecentsMap>;

  constructor(url: string, prefetchedResults?: Promise<ConfluenceRecentsMap>) {
    super(url);
    this.prefetchedResults = prefetchedResults;
  }

  async getRecentItems(
    searchSessionId: string,
  ): Promise<ConfluenceObjectResult[]> {
    if (this.prefetchedResults) {
      return (await this.prefetchedResults).objects.items;
    }
    return super.getRecentItems(searchSessionId);
  }

  async getRecentSpaces(searchSessionId: string): Promise<Result[]> {
    if (this.prefetchedResults) {
      return (await this.prefetchedResults).spaces.items;
    }
    return super.getRecentSpaces(searchSessionId);
  }

  async searchPeopleInQuickNav(
    query: string,
    searchSessionId: string,
  ): Promise<PersonResult[]> {
    if (this.prefetchedResults) {
      return (await this.prefetchedResults).people.items;
    }
    return super.searchPeopleInQuickNav(query, searchSessionId);
  }
}
