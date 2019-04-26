import { LRUCache } from 'lru-fast';
import { Observable } from 'rxjs/Observable';
import { FileState } from '@atlaskit/media-client';

export interface StateDeferredValue<T> {
  promise: Promise<T>;
  resolve: Function;
  value?: T;
}

export interface CachedMediaState<T> {
  streams: LRUCache<string, Observable<T>>;
  stateDeferreds: Map<string, StateDeferredValue<T>>;
}

export const mediaState: CachedMediaState<FileState> = {
  streams: new LRUCache<string, Observable<FileState>>(1000),
  stateDeferreds: new Map<string, StateDeferredValue<FileState>>(),
};
