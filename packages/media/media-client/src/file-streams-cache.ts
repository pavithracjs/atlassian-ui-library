import { LRUCache } from 'lru-fast';
import { Observable } from 'rxjs/Observable';
import { FileState } from './models/file-state';

export class StreamsCache<T> {
  constructor(private readonly streams: LRUCache<string, Observable<T>>) {}

  has(id: string): boolean {
    return !!this.streams.find(id);
  }

  set(id: string, stream: Observable<T>) {
    this.streams.set(id, stream);
  }

  get(id: string): Observable<T> | undefined {
    return this.streams.get(id);
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
    streamCache = new StreamsCache<FileState>(mediaState.streams);
  }
  return streamCache;
};
