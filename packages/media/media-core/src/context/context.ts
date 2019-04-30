import { ContextConfig } from '..';

import {
  CollectionFetcher,
  MediaStoreGetFileImageParams,
  ImageMetadata,
  FileFetcher,
  MediaClient,
} from '@atlaskit/media-client';

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

  readonly collection: CollectionFetcher;
  readonly file: FileFetcher;
  readonly config: ContextConfig;
}

export class ContextFactory {
  public static create(config: ContextConfig): Context {
    return new MediaClient(config);
  }
}
