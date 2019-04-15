import {
  MediaStore,
  ContextConfig,
  MediaStoreGetFileImageParams,
  ImageMetadata,
} from '@atlaskit/media-store';
import { EventEmitter2 } from 'eventemitter2';
import { CollectionFetcher } from '../collection';
import { FileFetcherImpl, FileFetcher } from '../file';
import { UploadEventPayloadMap, EventPayloadListener } from './events';

export interface Context {
  getImage(
    id: string,
    params?: MediaStoreGetFileImageParams,
    controller?: AbortController,
  ): Promise<Blob>;
  getImageMetadata(
    id: string,
    params?: MediaStoreGetFileImageParams,
  ): Promise<ImageMetadata>;
  getImageUrl(
    id: string,
    params?: MediaStoreGetFileImageParams,
  ): Promise<string>;
  on<E extends keyof UploadEventPayloadMap>(
    event: E,
    listener: EventPayloadListener<UploadEventPayloadMap, E>,
  ): void;
  off<E extends keyof UploadEventPayloadMap>(
    event: E,
    listener: EventPayloadListener<UploadEventPayloadMap, E>,
  ): void;
  emit<E extends keyof UploadEventPayloadMap>(
    event: E,
    payload: UploadEventPayloadMap[E],
  ): boolean;

  readonly collection: CollectionFetcher;
  readonly file: FileFetcher;
  readonly config: ContextConfig;
}

export class ContextFactory {
  public static create(config: ContextConfig): Context {
    return new ContextImpl(config);
  }
}

class ContextImpl implements Context {
  private readonly mediaStore: MediaStore;
  private readonly eventEmitter: EventEmitter2;
  readonly collection: CollectionFetcher;
  readonly file: FileFetcher;

  constructor(readonly config: ContextConfig) {
    this.mediaStore = new MediaStore({
      authProvider: config.authProvider,
    });
    this.collection = new CollectionFetcher(this.mediaStore);
    this.file = new FileFetcherImpl(this.mediaStore);
    this.eventEmitter = new EventEmitter2();
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

  getImage(
    id: string,
    params?: MediaStoreGetFileImageParams,
    controller?: AbortController,
  ): Promise<Blob> {
    return this.mediaStore.getImage(id, params, controller);
  }

  getImageUrl(
    id: string,
    params?: MediaStoreGetFileImageParams,
  ): Promise<string> {
    return this.mediaStore.getFileImageURL(id, params);
  }

  async getImageMetadata(
    id: string,
    params?: MediaStoreGetFileImageParams,
  ): Promise<ImageMetadata> {
    return (await this.mediaStore.getImageMetadata(id, params)).metadata;
  }
}
