import { LRUCache } from 'lru-fast';

export const mediaState: any = {
  streams: new LRUCache<string, any>(1000),
  stateDeferreds: new Map<
    string,
    { promise: Promise<any>; resolve: Function; value?: any }
  >(),
};
