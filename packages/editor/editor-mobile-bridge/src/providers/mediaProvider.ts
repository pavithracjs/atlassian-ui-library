import { MediaProvider } from '@atlaskit/editor-core';
import {
  Auth,
  AuthContext,
  ClientBasedAuth,
  ContextFactory as MediaContextFactory,
} from '@atlaskit/media-core';

import { createPromise } from '../cross-platform-promise';

const getMediaToken = (context?: AuthContext): Promise<Auth> =>
  createPromise<ClientBasedAuth>(
    'getAuth',
    // if collectionName exists in media's AuthContext, pass it along
    // some app (Confluence?) might use it to request proper permissions on that collection
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
    uploadParams: {
      collection: '', // initially empty, will be returned by upload-end event
    },
  } as MediaProvider;
}

export default mediaProviderFactory();
