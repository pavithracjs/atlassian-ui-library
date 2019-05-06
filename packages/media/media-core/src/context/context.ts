import {
  CollectionFetcher,
  MediaStoreGetFileImageParams,
  ImageMetadata,
  FileFetcher,
  MediaClient,
  UploadEventPayloadMap,
  EventPayloadListener,
} from '@atlaskit/media-client';
import { ContextConfig } from '..';

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
    return new MediaClient(config);
  }
}
