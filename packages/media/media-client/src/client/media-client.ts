import { EventEmitter2 } from 'eventemitter2';
import { MediaClientConfig } from '@atlaskit/media-core';
import {
  MediaStore,
  MediaStoreGetFileImageParams,
  ImageMetadata,
} from './media-store';
import { CollectionFetcher } from './collection-fetcher';
import { FileFetcherImpl, FileFetcher } from './file-fetcher';
import { UploadEventPayloadMap, EventPayloadListener } from './events';

export class MediaClient {
  public readonly mediaStore: MediaStore;
  public readonly collection: CollectionFetcher;
  public readonly file: FileFetcher;
  // TODO move it to private after MS-1833
  public readonly eventEmitter: EventEmitter2;

  constructor(readonly config: MediaClientConfig) {
    this.mediaStore = new MediaStore({
      authProvider: config.authProvider,
    });
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
