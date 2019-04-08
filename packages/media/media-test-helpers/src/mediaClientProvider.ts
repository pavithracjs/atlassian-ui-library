import { MediaClient } from '@atlaskit/media-client';
import { MediaClientConfig } from '@atlaskit/media-core';
import { StoryBookAuthProvider } from './authProvider';
import { collectionNames } from './collectionNames';
import { mediaPickerAuthProvider } from './mediaPickerAuthProvider';
import { userAuthProvider } from './userAuthProvider';
import { AuthParameter } from './contextProvider';

const defaultAuthParameter: AuthParameter = {
  authType: 'client',
};

/**
 * Creates and returns `Context` (from `media-core`) based on the data provided in parameter object.
 *
 * @param {AuthParameter} authParameter specifies serviceName and whatever auth should be done with clientId or asapIssuer
 * @returns {Context}
 */
export const createStorybookMediaClient = (
  authParameter: AuthParameter = defaultAuthParameter,
): MediaClient => {
  return new MediaClient(createStorybookMediaClientConfig(authParameter));
};

export const createStorybookMediaClientConfig = (
  authParameter: AuthParameter = defaultAuthParameter,
): MediaClientConfig => {
  const scopes: { [resource: string]: string[] } = {
    'urn:filestore:file:*': ['read'],
    'urn:filestore:chunk:*': ['read'],
  };
  collectionNames.forEach(c => {
    scopes[`urn:filestore:collection:${c}`] = ['read', 'update'];
  });

  const isAsapEnvironment = authParameter.authType === 'asap';
  const authProvider = StoryBookAuthProvider.create(isAsapEnvironment, scopes);
  return { authProvider };
};

export const createUploadMediaClient = () =>
  new MediaClient(createUploadMediaClientConfig());

export const createUploadMediaClientConfig = (): MediaClientConfig => ({
  authProvider: mediaPickerAuthProvider('asap'),
  userAuthProvider,
});
