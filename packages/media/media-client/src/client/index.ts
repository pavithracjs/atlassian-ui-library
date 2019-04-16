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
export { FileFetcher } from './file-fetcher';
import { FileFetcher } from './file-fetcher';

export class MediaClient {
  public readonly mediaStore: MediaStore;
  public readonly collection: CollectionFetcher;
  public readonly file: FileFetcher;
  // Deprecated value introduced for backward compatibility with Context
  public readonly config: MediaClientConfig;

  constructor(readonly mediaClientConfig: MediaClientConfig) {
    this.mediaStore = new MediaStore({
      authProvider: mediaClientConfig.authProvider,
    });
    this.config = mediaClientConfig;
    this.collection = new CollectionFetcher(this.mediaStore);
    this.file = new FileFetcher(this.mediaStore);
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
}
