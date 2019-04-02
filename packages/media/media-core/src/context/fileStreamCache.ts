import { FileState } from '../fileState';
import { LRUMap } from 'lru_map';
import { Observable } from 'rxjs/Observable';
import { observableToPromise } from '../utils/observableToPromise';

export class FileStreamCache {
  private readonly fileStreams: LRUMap<string, Observable<FileState>>;
  private readonly stateDeferreds: Map<
    string,
    { promise: Promise<FileState>; resolve: Function }
  >;

  constructor() {
    this.fileStreams = new LRUMap(1000);
    this.stateDeferreds = new Map();
  }

  has(id: string): boolean {
    return !!this.fileStreams.find(id);
  }

  set(id: string, fileStream: Observable<FileState>) {
    this.fileStreams.set(id, fileStream);
    const deferred = this.stateDeferreds.get(id);

    if (deferred) {
      observableToPromise(fileStream).then(state => {
        deferred.resolve(state);
      });
    }
  }

  get(id: string): Observable<FileState> | undefined {
    return this.fileStreams.get(id);
  }

  getCurrentState(id: string): Promise<FileState> {
    const state = this.get(id);

    if (state) {
      return observableToPromise(state);
    }
    const deferred = this.stateDeferreds.get(id);
    if (deferred) {
      return deferred.promise;
    }
    const promise = new Promise<FileState>(resolve => {
      this.stateDeferreds.set(id, { promise, resolve });
    });

    return promise;
  }

  getOrInsert(
    id: string,
    callback: () => Observable<FileState>,
  ): Observable<FileState> {
    if (!this.has(id)) {
      this.set(id, callback());
    }
    return this.get(id)!;
  }

  removeAll() {
    this.fileStreams.clear();
  }

  remove(id: string) {
    this.fileStreams.delete(id);
  }

  get size(): number {
    return this.fileStreams.size;
  }
}

export const fileStreamsCache = new FileStreamCache();
export default FileStreamCache;
