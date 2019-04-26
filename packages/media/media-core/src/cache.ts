import { LRUCache } from 'lru-fast';
import { FileState } from '@atlaskit/media-client';

export interface StateDeferredValue<T> {
  promise: Promise<any>;
  resolve: Function;
  value?: T;
}

export interface CachedMediaState<T> {
  streams: LRUCache<string, T>;
  stateDeferreds: Map<string, StateDeferredValue<T>>;
}

export const mediaState: CachedMediaState<FileState> = {
  streams: new LRUCache<string, FileState>(1000),
  stateDeferreds: new Map<string, StateDeferredValue<FileState>>(),
};
