import { Identifier } from '@atlaskit/media-client';
import {
  constructAuthTokenUrl,
  getSelectedIndex,
} from '../../../../newgen/utils';
import { fakeMediaClient } from '@atlaskit/media-test-helpers';

describe('utils', () => {
  describe('constructAuthTokenUrl', () => {
    it('should add auth token and client query parameters to the url when auth is client based', async () => {
      const mediaClient = fakeMediaClient();
      const url = await constructAuthTokenUrl(
        '/file/3333-4444-5555',
        mediaClient,
        'mycollection',
      );
      expect(url).toEqual(
        'some-service-host/file/3333-4444-5555?client=some-client-id&collection=mycollection&token=some-token',
      );
    });

    it('should work with urls with params', async () => {
      const mediaClient = fakeMediaClient();
      const url = await constructAuthTokenUrl(
        '/file/3333-4444-5555?version=1',
        mediaClient,
        'mycollection',
      );
      expect(url).toEqual(
        'some-service-host/file/3333-4444-5555?version=1&client=some-client-id&collection=mycollection&token=some-token',
      );
    });

    it('should add the auth token to the url when auth type is ASAP', async () => {
      const issuer = 'some-issuer'; // issuer gets send through the headers, so it shouldn't show up in the url
      const authPromise = Promise.resolve({
        token: 'some-token',
        asapIssuer: issuer,
        baseUrl: 'some-base-url',
      });
      const mediaClient = fakeMediaClient({
        authProvider: () => authPromise,
      });
      const url = await constructAuthTokenUrl(
        '/file/3333-4444-5555',
        mediaClient,
        'mycollection',
      );
      expect(url).toEqual(
        'some-base-url/file/3333-4444-5555?collection=mycollection&issuer=some-issuer&token=some-token',
      );
    });
  });

  describe('getSelectedIndex', () => {
    it('should return the right index if item is found', () => {
      const identifier: Identifier = {
        id: 'some-id',
        occurrenceKey: 'some-custom-occurrence-key',
        mediaItemType: 'file',
      };
      const identifier2: Identifier = {
        id: 'some-id-2',
        occurrenceKey: 'some-custom-occurrence-key',
        mediaItemType: 'file',
      };

      const items = [identifier, identifier2];
      expect(getSelectedIndex(items, identifier)).toEqual(0);
    });

    it('should return -1 if item is not found', () => {
      const identifier: Identifier = {
        id: 'some-id',
        occurrenceKey: 'some-custom-occurrence-key',
        mediaItemType: 'file',
      };
      const identifier2: Identifier = {
        id: 'some-id-2',
        occurrenceKey: 'some-custom-occurrence-key',
        mediaItemType: 'file',
      };
      const notFoundIdentifier: Identifier = {
        id: 'some-id-not-found',
        occurrenceKey: 'some-custom-occurrence-key',
        mediaItemType: 'file',
      };

      const items = [identifier, identifier2];
      expect(getSelectedIndex(items, notFoundIdentifier)).toEqual(-1);
    });

    it('should work with external image identifiers', () => {
      const identifier: Identifier = {
        id: 'some-id',
        occurrenceKey: 'some-custom-occurrence-key',
        mediaItemType: 'file',
      };
      const identifier2: Identifier = {
        dataURI: 'some-src-1',
        mediaItemType: 'external-image',
      };
      const identifier3: Identifier = {
        dataURI: 'some-src-2',
        mediaItemType: 'external-image',
      };

      const items = [identifier, identifier3, identifier2];
      expect(getSelectedIndex(items, identifier3)).toEqual(1);
    });
  });
});
