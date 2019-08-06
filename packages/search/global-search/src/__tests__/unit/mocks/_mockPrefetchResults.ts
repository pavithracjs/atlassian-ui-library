import { ConfluenceRecentsMap, Result } from '../../../model/Result';

const confluenceRecentItemsPromise: Promise<
  ConfluenceRecentsMap
> = Promise.resolve({
  objects: {
    items: [],
    totalSize: 0,
  },
  spaces: {
    items: [],
    totalSize: 0,
  },
  people: {
    items: [],
    totalSize: 0,
  },
});
const abTestPromise: Promise<Result[]> = Promise.resolve([]);

export const mockConfluencePrefetchedData = jest.fn(() => {
  return {
    confluenceRecentItemsPromise,
    abTestPromise,
  };
});
