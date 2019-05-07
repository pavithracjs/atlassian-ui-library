import { Server } from 'kakapo';
import * as exenv from 'exenv';
import uuid from 'uuid/v4';

import { MediaFile, MediaType } from '@atlaskit/media-store';

import { createApiRouter, createMediaPlaygroundRouter } from './routers';
import { createDatabase } from './database';
import { mapDataUriToBlob } from '../utils';

export type MockCollections = {
  [key: string]: Array<MediaFile & { blob: Blob }>;
};
export class MediaMock {
  private server = new Server();

  constructor(readonly collections?: MockCollections) {}

  enable(): void {
    if (!exenv.canUseDOM) {
      return;
    }

    this.server.use(createDatabase(this.collections));
    this.server.use(createMediaPlaygroundRouter());
    this.server.use(createApiRouter());
  }

  disable(): void {
    // TODO: add teardown logic to kakapo server
    /* eslint-disable no-console */
    console.warn('Disabling logic is not implemented in MediaMock');
  }
}

export function generateFilesFromTestData(
  files: (Partial<MediaFile> & { dataUri: string })[],
): Array<MediaFile & { blob: Blob }> {
  return files.map(file => {
    const blob = mapDataUriToBlob(file.dataUri);
    const id = file.id || uuid();
    const name = file.name || `test-file-${id}`;
    return {
      id,
      blob,
      mimeType: blob.type,
      mediaType: 'image' as MediaType,
      name,
      size: blob.size,
      artifacts: {},
      representations: {
        image: {},
      },
    };
  });
}

export const mediaMock = new MediaMock();
