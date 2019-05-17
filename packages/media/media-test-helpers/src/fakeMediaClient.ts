import { from } from 'rxjs/observable/from';
import { of } from 'rxjs/observable/of';

import { MediaApiConfig, MediaClientConfig } from '@atlaskit/media-core';
import { FileState, MediaClient, MediaStore } from '@atlaskit/media-client';

import { asMock } from './jestHelpers';

export interface FakeMediaClientConfig extends MediaClientConfig {
  mockFileStates: FileState[];
}

export const getDefaultMediaClientConfig = (): FakeMediaClientConfig => ({
  authProvider: jest.fn().mockReturnValue(() =>
    Promise.resolve({
      clientId: 'some-client-id',
      token: 'some-token',
      baseUrl: 'some-service-host',
    }),
  ),
  mockFileStates: [],
});

export const fakeMediaClient = (
  config: FakeMediaClientConfig = getDefaultMediaClientConfig(),
): MediaClient => {
  if (jest && jest.genMockFromModule) {
    const {
      MediaClient: MockMediaClient,
      FileFetcherImpl,
      CollectionFetcher,
    } = jest.genMockFromModule('@atlaskit/media-client');
    const mediaClient = new MockMediaClient();

    const fileFetcher = new FileFetcherImpl();
    const collectionFetcher = new CollectionFetcher();
    const mockMediaStore = new MediaStore({
      authProvider: config.authProvider,
    } as MediaApiConfig);
    mediaClient.file = fileFetcher;
    mediaClient.collection = collectionFetcher;
    mediaClient.config = config;
    mediaClient.config = config;
    mediaClient.mediaStore = mockMediaStore;

    asMock(mediaClient.getImageUrl).mockResolvedValue('some-image-url');
    asMock(mediaClient.getImage).mockImplementation(mockMediaStore.getImage);
    asMock(mediaClient.collection.getItems).mockReturnValue(of([]));
    asMock(mediaClient.file.getFileState).mockReturnValue(
      from(config.mockFileStates),
    );
    return mediaClient;
  } else {
    return new MediaClient(config);
  }
};
