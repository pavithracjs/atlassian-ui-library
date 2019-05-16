import { ConfluenceRecentsMap, Result } from '../../model/Result';

const confluenceRecentItemsPromise: Promise<
  ConfluenceRecentsMap
> = Promise.resolve({
  objects: [],
  spaces: [],
});
const abTestPromise: Promise<Result[]> = Promise.resolve([]);
const recentPeoplePromise: Promise<Result[]> = Promise.resolve([]);

export const getConfluencePrefetchedData = jest.fn(() => {
  return {
    confluenceRecentItemsPromise,
    abTestPromise,
    recentPeoplePromise,
  };
});

export { confluenceRecentItemsPromise, abTestPromise, recentPeoplePromise };
