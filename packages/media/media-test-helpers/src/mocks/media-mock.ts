import { Server } from 'kakapo';
import * as exenv from 'exenv';

import { MediaFile } from '@atlaskit/media-store';

import { createApiRouter, createMediaPlaygroundRouter } from './routers';
import {
  createDatabase,
  generateUserData,
  generateTenantData,
} from './database';

export type MockCollection = { [filename: string]: string };
export class MediaMock {
  private server = new Server();

  constructor(
    readonly collection?: MockCollection,
    readonly tenantCollection?: MockCollection,
  ) {}

  enable(): [Promise<MediaFile[]>, Promise<MediaFile[]>] | undefined {
    if (!exenv.canUseDOM) {
      return;
    }

    this.server.use(createDatabase());
    this.server.use(createMediaPlaygroundRouter());
    this.server.use(createApiRouter());

    return [
      generateUserData(this.collection),
      generateTenantData(this.tenantCollection),
    ];
  }

  disable() {
    // TODO: add teardown logic to kakapo server
    /* eslint-disable no-console */
    console.warn('Disabling logic is not implemented in MediaMock');
  }
}

export const mediaMock = new MediaMock();
