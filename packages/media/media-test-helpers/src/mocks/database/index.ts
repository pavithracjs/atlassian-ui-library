import { Database } from 'kakapo';
import uuidV4 from 'uuid/v4';

import { ClientBasedAuth } from '@atlaskit/media-core';
import { MediaCollection } from '@atlaskit/media-store';

import { createCollection } from './collection';
import { CollectionItem, createCollectionItem } from './collection-item';
import { createUpload, Upload } from './upload';
import { Chunk } from './chunk';
import { defaultBaseUrl } from '../../contextProvider';
import { MockCollections } from '../media-mock';

export * from './collection';
export * from './collection-item';

export const tenantAuth: ClientBasedAuth = {
  clientId: uuidV4(),
  token: 'some-tenant-token',
  baseUrl: defaultBaseUrl,
};

export const userAuth: ClientBasedAuth = {
  clientId: uuidV4(),
  token: 'some-user-token',
  baseUrl: defaultBaseUrl,
};

export const userAuthProvider = () => Promise.resolve(userAuth);
export const tenantAuthProvider = () => Promise.resolve(tenantAuth);

export type DatabaseSchema = {
  collection: MediaCollection;
  collectionItem: CollectionItem;
  upload: Upload;
  chunk: Chunk;
};

export function createDatabase(
  collections: MockCollections = {},
): Database<DatabaseSchema> {
  const database = new Database<DatabaseSchema>();

  database.register('collectionItem', createCollectionItem);
  database.register('collection', createCollection);
  database.register('upload', createUpload);
  database.register('chunk');

  if (Object.keys(collections).length > 0) {
    Object.keys(collections).forEach(collectionName => {
      database.push('collection', {
        name: collectionName,
        createdAt: Date.now(),
      });
      collections[collectionName].forEach(({ id, name, blob, mimeType }) =>
        database.push(
          'collectionItem',
          createCollectionItem({
            id,
            collectionName,
            blob,
            occurrenceKey: uuidV4(),
            mimeType,
            name,
          }),
        ),
      );
    });
  }

  return database;
}
