import { LRUCache } from 'lru-fast';
import { Observable } from 'rxjs/Observable';
import { FileState } from './models/file-state';
import { observableToPromise } from './utils';

export class StreamsCache<T> {
  constructor(
    private readonly stateDeferreds: Map<
      string,
      { promise: Promise<T>; resolve: Function; value?: T }
    >,
    private readonly streams: LRUCache<string, Observable<T>>,
  ) {}

  has(id: string): boolean {
    return !!this.streams.find(id);
  }

  set(id: string, stream: Observable<T>) {
    this.streams.set(id, stream);
    const deferred = this.stateDeferreds.get(id);

    if (deferred) {
      observableToPromise(stream).then(state => {
        deferred.resolve(state);
      });
    }
  }

  get(id: string): Observable<T> | undefined {
    return this.streams.get(id);
  }

  getCurrentState(id: string): Promise<T> {
    const state = this.get(id);

    if (state) {
      return observableToPromise(state);
    }
    const deferred = this.stateDeferreds.get(id);
    if (deferred) {
      return deferred.promise;
    }
    const promise = new Promise<T>(resolve => {
      this.stateDeferreds.set(id, { promise, resolve });
    });

    return promise;
  }

  getOrInsert(id: string, callback: () => Observable<T>): Observable<T> {
    if (!this.has(id)) {
      this.set(id, callback());
    }
    return this.get(id)!;
  }

  removeAll() {
    this.streams.removeAll();
  }

  remove(id: string) {
    this.streams.remove(id);
  }

  get size(): number {
    return this.streams.size;
  }
}

let streamCache: StreamsCache<FileState>;
export const getFileStreamsCache = () => {
  if (!streamCache) {
    const mediaState = require('@atlaskit/media-core').mediaState;
    streamCache = new StreamsCache<FileState>(
      mediaState.stateDeferreds,
      mediaState.streams,
    );
  }
  return streamCache;
};
