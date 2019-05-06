import { Database } from 'kakapo';
import uuidV4 from 'uuid/v4';

import { ClientBasedAuth } from '@atlaskit/media-core';
import { MediaStore, MediaCollection, MediaFile } from '@atlaskit/media-store';

import { getFakeFileName, fakeImage } from './mockData';
import { mapDataUriToBlob } from '../../utils';
import { createCollection } from './collection';
import { CollectionItem, createCollectionItem } from './collection-item';
import { createUpload, Upload } from './upload';
import { Chunk } from './chunk';
import { defaultBaseUrl } from '../../contextProvider';
import { MockCollection } from '../media-mock';
import { defaultCollectionName } from '../../index';

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

export function createDatabase(): Database<DatabaseSchema> {
  const database = new Database<DatabaseSchema>();

  database.register('collectionItem', createCollectionItem);
  database.register('collection', createCollection);
  database.register('upload', createUpload);
  database.register('chunk');

  return database;
}

export async function generateUserData(
  collectionData: MockCollection = {},
): Promise<Array<MediaFile>> {
  const mediaStore = new MediaStore({
    authProvider: userAuthProvider,
  });

  const collection = 'recents';
  mediaStore.createCollection(collection);

  if (collectionData) {
    return Promise.all(
      Object.keys(collectionData).map(async filename => {
        const dataUri = collectionData[filename];
        const image = mapDataUriToBlob(dataUri);

        return (await mediaStore.createFileFromBinary(image, {
          name: filename,
          collection,
          occurrenceKey: uuidV4(),
        })).data;
      }),
    );
  } else {
    // just insert 10 random files with the same image
    const image = mapDataUriToBlob(fakeImage);

    return Promise.all(
      (Array.apply(null, { length: 10 }) as number[])
        .map(Number.call, Number)
        .map(
          async () =>
            (await mediaStore.createFileFromBinary(image, {
              name: getFakeFileName(),
              collection,
              occurrenceKey: uuidV4(),
            })).data,
        ),
    );
  }
}

export async function generateTenantData(
  collection: MockCollection = {},
): Promise<Array<MediaFile>> {
  const mediaStore = new MediaStore({
    authProvider: tenantAuthProvider,
  });

  mediaStore.createCollection(defaultCollectionName);
  return Promise.all(
    Object.keys(collection).map(
      async fileName =>
        (await mediaStore.createFileFromBinary(
          mapDataUriToBlob(collection[fileName]),
          {
            collection: defaultCollectionName,
            name: fileName,
          },
        )).data,
    ),
  );
}
