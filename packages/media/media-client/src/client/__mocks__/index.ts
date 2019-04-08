import { MediaClientConfig } from '@atlaskit/media-core';
import { CollectionFetcher } from '../collection-fetcher';
import { FileFetcher } from '../file-fetcher';

export class MediaClient {
  public readonly collection: CollectionFetcher;
  public readonly file: FileFetcher;

  constructor(readonly config: MediaClientConfig) {
    this.collection = new CollectionFetcher({} as any);
    this.file = new FileFetcher({} as any);
  }

  public getImage = jest.fn();
  public getImageUrl = jest.fn();
  public getImageMetadata = jest.fn();
}
