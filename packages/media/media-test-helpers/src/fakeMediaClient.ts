import { of } from 'rxjs/observable/of';

import { MediaApiConfig, MediaClientConfig } from '@atlaskit/media-core';
import { MediaClient } from '@atlaskit/media-client';

import { asMock } from './jestHelpers';

export const getDefaultMediaClientConfig = (): MediaClientConfig => ({
  authProvider: jest.fn().mockReturnValue(() =>
    Promise.resolve({
      clientId: 'some-client-id',
      token: 'some-token',
      baseUrl: 'some-service-host',
    }),
  ),
});

export const fakeMediaClient = (
  config: MediaClientConfig = getDefaultMediaClientConfig(),
): MediaClient => {
  if (jest && jest.genMockFromModule) {
    const {
      MediaClient: MockMediaClient,
      MediaStore,
      FileFetcher,
      CollectionFetcher,
    } = jest.genMockFromModule('@atlaskit/media-client');
    const mediaClient = new MockMediaClient();

    const fileFetcher = new FileFetcher();
    const collectionFetcher = new CollectionFetcher();
    const mediaStore = new MediaStore({} as MediaApiConfig);
    mediaClient.file = fileFetcher;
    mediaClient.collection = collectionFetcher;
    mediaClient.mediaClientConfig = config;
    mediaClient.mediaStore = mediaStore;

    asMock(mediaClient.getImageUrl).mockResolvedValue('some-image-url');
    asMock(mediaClient.collection.getItems).mockReturnValue(of([]));
    asMock(mediaClient.file.getFileState).mockReturnValue(of({}));
    return mediaClient;
  } else {
    return new MediaClient(config);
  }
};
