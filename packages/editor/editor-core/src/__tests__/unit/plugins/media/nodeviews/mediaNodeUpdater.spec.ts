jest.mock('@atlaskit/media-client');

import { ContextIdentifierProvider } from '@atlaskit/editor-common';
import { EditorView } from 'prosemirror-view';
import { getMediaClient, FileState } from '@atlaskit/media-client';
import {
  getDefaultMediaClientConfig,
  asMockReturnValue,
  fakeMediaClient,
  asMock,
} from '@atlaskit/media-test-helpers';
import { MediaClientConfig } from '@atlaskit/media-core';
import * as commands from '../../../../../plugins/media/commands';
import {
  MediaNodeUpdater,
  MediaNodeUpdaterProps,
} from '../../../../../plugins/media/nodeviews/mediaNodeUpdater';
import * as mediaCommon from '../../../../../plugins/media/utils/media-common';
import { MediaProvider } from '../../../../../plugins/media/pm-plugins/main';

describe('MediaNodeUpdater', () => {
  const setup = (props?: Partial<MediaNodeUpdaterProps>) => {
    jest.resetAllMocks();
    jest.spyOn(commands, 'updateMediaNodeAttrs').mockReturnValue(() => {});
    jest
      .spyOn(mediaCommon, 'getViewMediaClientConfigFromMediaProvider')
      .mockReturnValue(getDefaultMediaClientConfig());

    const mediaClient = fakeMediaClient();
    asMockReturnValue(getMediaClient, mediaClient);
    const contextIdentifierProvider: Promise<
      ContextIdentifierProvider
    > = Promise.resolve({
      containerId: '',
      objectId: 'object-id',
    });
    const viewMediaClientConfig = getDefaultMediaClientConfig();
    const authFromContext = Promise.resolve({
      clientId: 'auth-context-client-id',
      token: 'auth-context-token',
      baseUrl: 'some-service-host',
    });
    const uploadMediaClientConfig: MediaClientConfig = {
      ...getDefaultMediaClientConfig(),
      getAuthFromContext: jest.fn().mockReturnValue(authFromContext),
    };
    const mediaProvider: Promise<MediaProvider> = Promise.resolve({
      viewMediaClientConfig,
      uploadMediaClientConfig,
      uploadParams: {
        collection: 'destination-collection',
      },
    });
    const node: any = {
      attrs: {
        id: 'source-file-id',
        collection: 'source-collection',
        __contextId: 'source-context-id',
      },
    };
    const mediaNodeUpdater = new MediaNodeUpdater({
      view: {} as EditorView,
      node,
      contextIdentifierProvider,
      mediaProvider,
      isMediaSingle: true,
      ...props,
    });

    return {
      mediaNodeUpdater,
      mediaClient,
      uploadMediaClientConfig,
      authFromContext,
    };
  };

  describe('updateContextId()', () => {
    it('should update node attrs with contextId', async () => {
      const { mediaNodeUpdater } = setup();

      await mediaNodeUpdater.updateContextId();

      expect(commands.updateMediaNodeAttrs).toBeCalledTimes(1);
      expect(commands.updateMediaNodeAttrs).toBeCalledWith(
        'source-file-id',
        {
          __contextId: 'object-id',
          contextId: 'object-id',
        },
        true,
      );
    });
  });

  describe('updateFileAttrs()', () => {
    it('should update node attrs with file attributes', async () => {
      const { mediaNodeUpdater } = setup();

      const mediaClient = fakeMediaClient();

      const fileState: Partial<FileState> = {
        size: 10,
        name: 'some-file',
        mimeType: 'image/jpeg',
      };

      asMock(mediaClient.file.getCurrentState).mockReturnValue(
        Promise.resolve(fileState),
      );

      asMockReturnValue(getMediaClient, mediaClient);

      await mediaNodeUpdater.updateFileAttrs();

      expect(mediaClient.file.getCurrentState).toBeCalledWith(
        'source-file-id',
        {
          collectionName: 'source-collection',
        },
      );
      expect(commands.updateMediaNodeAttrs).toBeCalledTimes(1);
      expect(commands.updateMediaNodeAttrs).toBeCalledWith(
        'source-file-id',
        {
          __fileName: 'some-file',
          __fileMimeType: 'image/jpeg',
          __fileSize: 10,
        },
        true,
      );
    });
  });

  describe('isNodeFromDifferentCollection()', () => {
    it('should return true if origin collection and destination collection are different', () => {
      const { mediaNodeUpdater } = setup();

      expect(mediaNodeUpdater.isNodeFromDifferentCollection()).toBeTruthy();
    });
  });

  describe('copyNode()', () => {
    it('should use getAuthFromContext to get auth', async () => {
      const { mediaNodeUpdater, uploadMediaClientConfig } = setup();

      await mediaNodeUpdater.copyNode();
      expect(uploadMediaClientConfig.getAuthFromContext).toBeCalledTimes(1);
      expect(uploadMediaClientConfig.getAuthFromContext).toBeCalledWith(
        'source-context-id',
      );
    });

    it('should call copyFile with right source and destination', async () => {
      const {
        mediaNodeUpdater,
        mediaClient,
        uploadMediaClientConfig,
        authFromContext,
      } = setup();

      await mediaNodeUpdater.copyNode();
      expect(mediaClient.file.copyFile).toBeCalledTimes(1);
      expect(mediaClient.file.copyFile).toBeCalledWith(
        {
          id: 'source-file-id',
          collection: 'source-collection',
          authProvider: expect.anything(),
        },
        {
          collection: 'destination-collection',
          authProvider: uploadMediaClientConfig.authProvider,
          occurrenceKey: expect.anything(),
        },
      );
      const authProvider = (mediaClient.file.copyFile as jest.Mock).mock
        .calls[0][0].authProvider;
      expect(authProvider()).toEqual(authFromContext);
    });

    it('should update media node attrs with the new id', async () => {
      const { mediaNodeUpdater } = setup({ isMediaSingle: false });

      await mediaNodeUpdater.copyNode();

      expect(commands.updateMediaNodeAttrs).toBeCalledTimes(1);
      expect(commands.updateMediaNodeAttrs).toBeCalledWith(
        'source-file-id',
        {
          id: 'copied-file-id',
          collection: 'destination-collection',
        },
        false,
      );
    });
  });
});
