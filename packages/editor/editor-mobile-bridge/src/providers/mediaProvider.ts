import { MediaProvider } from '@atlaskit/editor-core';
import {
  Auth,
  AuthContext,
  ContextFactory as MediaContextFactory,
} from '@atlaskit/media-core';

import { createPromise } from '../cross-platform-promise';
import { MediaAuthConfig } from '../types';

const getMediaToken = (context?: AuthContext): Promise<Auth> =>
  createPromise<MediaAuthConfig>(
    'getAuth',
    context && context.collectionName ? context.collectionName : undefined,
  ).submit();

async function mediaProviderFactory(): Promise<MediaProvider> {
  const mediaContext = Promise.resolve(
    MediaContextFactory.create({
      authProvider: (context?: AuthContext) => getMediaToken(context),
    }),
  );

  return {
    uploadContext: mediaContext,
    viewContext: mediaContext,
    uploadParams: {}, // needs to be defined
  };
}

export default mediaProviderFactory();
