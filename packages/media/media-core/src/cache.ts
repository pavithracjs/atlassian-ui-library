import { LRUCache } from 'lru-fast';

export interface StateDeferredValue {
  promise: Promise<any>;
  resolve: Function;
  value?: any;
}

export interface CachedMediaState {
  streams: LRUCache<string, any>;
  stateDeferreds: Map<string, StateDeferredValue>;
}

export const mediaState: CachedMediaState = {
  streams: new LRUCache<string, any>(1000),
  stateDeferreds: new Map<string, StateDeferredValue>(),
};
