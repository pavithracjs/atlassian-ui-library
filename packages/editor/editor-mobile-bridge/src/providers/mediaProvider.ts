import { MediaProvider } from '@atlaskit/editor-core';
import { Auth, AuthContext, ClientBasedAuth } from '@atlaskit/media-core';

import { createPromise } from '../cross-platform-promise';

const getMediaToken = (context?: AuthContext): Promise<Auth> =>
  createPromise<ClientBasedAuth>(
    'getAuth',
    // if collectionName exists in media's AuthContext, pass it along
    // otherwise pass an empty string (note that undefined doesn't work well with native promises)
    context && context.collectionName ? context.collectionName : '',
  ).submit();

async function createMediaProvider(): Promise<MediaProvider> {
  const mediaClientConfig = Promise.resolve({
    authProvider: (context?: AuthContext) => getMediaToken(context),
  });

  return {
    uploadMediaClientConfig: mediaClientConfig,
    viewMediaClientConfig: mediaClientConfig,
    uploadParams: {
      collection: '', // initially empty, will be returned by upload-end event
    },
  } as MediaProvider;
}

export default createMediaProvider();
