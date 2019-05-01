import { EventEmitter2 } from 'eventemitter2';
import { MediaClientConfig } from '@atlaskit/media-core';
export {
  MediaStore,
  MediaStoreGetFileImageParams,
  ImageMetadata,
} from './media-store';
import {
  MediaStore,
  MediaStoreGetFileImageParams,
  ImageMetadata,
} from './media-store';
export { CollectionFetcher } from './collection-fetcher';
import { CollectionFetcher } from './collection-fetcher';
export { FileFetcherImpl, FileFetcher } from './file-fetcher';
import { FileFetcherImpl, FileFetcher } from './file-fetcher';
import { UploadEventPayloadMap, EventPayloadListener } from './events';

export class MediaClient {
  public readonly mediaStore: MediaStore;
  public readonly collection: CollectionFetcher;
  public readonly file: FileFetcher;
  private readonly eventEmitter: EventEmitter2;
  // Deprecated value introduced for backward compatibility with Context
  public readonly config: MediaClientConfig;

  constructor(readonly mediaClientConfig: MediaClientConfig) {
    this.mediaStore = new MediaStore({
      authProvider: mediaClientConfig.authProvider,
    });
    this.config = mediaClientConfig;
    this.collection = new CollectionFetcher(this.mediaStore);
    this.file = new FileFetcherImpl(this.mediaStore);
    this.eventEmitter = new EventEmitter2();
  }

  public getImage(
    id: string,
    params?: MediaStoreGetFileImageParams,
    controller?: AbortController,
  ): Promise<Blob> {
    return this.mediaStore.getImage(id, params, controller);
  }

  public getImageUrl(
    id: string,
    params?: MediaStoreGetFileImageParams,
  ): Promise<string> {
    return this.mediaStore.getFileImageURL(id, params);
  }

  public async getImageMetadata(
    id: string,
    params?: MediaStoreGetFileImageParams,
  ): Promise<ImageMetadata> {
    return (await this.mediaStore.getImageMetadata(id, params)).metadata;
  }

  on<E extends keyof UploadEventPayloadMap>(
    event: E,
    listener: EventPayloadListener<UploadEventPayloadMap, E>,
  ): void {
    this.eventEmitter.on(event, listener);
  }

  off<E extends keyof UploadEventPayloadMap>(
    event: E,
    listener: EventPayloadListener<UploadEventPayloadMap, E>,
  ): void {
    this.eventEmitter.off(event, listener);
  }

  emit<E extends keyof UploadEventPayloadMap>(
    event: E,
    payload: UploadEventPayloadMap[E],
  ): boolean {
    return this.eventEmitter.emit(event, payload);
  }
}
