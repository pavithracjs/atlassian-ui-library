jest.mock('@atlaskit/media-store');
import { MediaStore } from '@atlaskit/media-store';
import { Auth } from '@atlaskit/media-core';
import { getFileStreamsCache, FileState } from '@atlaskit/media-client';
import {
  mockStore,
  mockFetcher,
  expectFunctionToHaveBeenCalledWith,
  asMock,
  fakeMediaClient,
} from '@atlaskit/media-test-helpers';
import { sendUploadEvent } from '../../../actions/sendUploadEvent';
import finalizeUploadMiddleware, { finalizeUpload } from '../../finalizeUpload';
import {
  FinalizeUploadAction,
  FINALIZE_UPLOAD,
} from '../../../actions/finalizeUpload';
import { State } from '../../../domain';
import { ReplaySubject, Observable } from 'rxjs';

describe('finalizeUploadMiddleware', () => {
  const auth: Auth = {
    clientId: 'some-client-id',
    token: 'some-token',
    baseUrl: 'some-base-url',
  };
  const file = {
    id: 'some-file-id',
    name: 'some-file-name',
    type: 'some-file-type',
    creationDate: Date.now(),
    size: 12345,
  };
  const copiedFile = {
    ...file,
    id: 'some-copied-file-id',
  };
  const collection = 'some-collection';
  const uploadId = 'some-upload-id';
  const source = {
    id: file.id,
    collection,
  };
  const setup = (state: Partial<State> = {}) => {
    const store = mockStore(state);
    const { userMediaClient } = store.getState();
    (userMediaClient.config.authProvider as jest.Mock<any>).mockReturnValue(
      Promise.resolve(auth),
    );

    const fetcher = mockFetcher();
    (MediaStore as any).mockImplementation(() => ({
      copyFileWithToken: () => Promise.resolve({ data: copiedFile }),
    }));
    fetcher.pollFile.mockImplementation(() => Promise.resolve(copiedFile));

    return {
      fetcher,
      store,
      next: jest.fn(),
      action: {
        type: FINALIZE_UPLOAD,
        file,
        uploadId,
        source,
      } as FinalizeUploadAction,
    };
  };

  it('should do nothing given unknown action', () => {
    const { fetcher, store, next } = setup();
    const action = {
      type: 'UNKNOWN',
    };

    finalizeUploadMiddleware(fetcher)(store)(next)(action);

    expect(store.dispatch).not.toBeCalled();
    expect(next).toBeCalledWith(action);
  });

  it('should send upload end event with metadata', () => {
    const { fetcher, store, action } = setup();

    return finalizeUpload(fetcher, store, action).then(action => {
      expect(action).toEqual(
        sendUploadEvent({
          event: {
            name: 'upload-end',
            data: {
              file,
              public: copiedFile,
            },
          },
          uploadId,
        }),
      );
    });
  });

  it('should send upload processing event with metadata', () => {
    const { fetcher, store, action } = setup();

    return finalizeUpload(fetcher, store, action).then(() => {
      expect(store.dispatch).toBeCalledWith(
        sendUploadEvent({
          event: {
            name: 'upload-processing',
            data: {
              file,
            },
          },
          uploadId,
        }),
      );
    });
  });

  it('should send upload error event given some error happens', () => {
    const { fetcher, store, action } = setup();
    const error = {
      message: 'some-error-message',
    };

    (MediaStore as any).mockImplementation(() => ({
      copyFileWithToken: () => Promise.reject(error),
    }));

    return finalizeUpload(fetcher, store, action).then(() => {
      expect(store.dispatch).toBeCalledWith(
        sendUploadEvent({
          event: {
            name: 'upload-error',
            data: {
              file,
              error: {
                name: 'object_create_fail',
                description: error.message,
              },
            },
          },
          uploadId,
        }),
      );
    });
  });

  it('should call copyFileWithToken with the right params', async () => {
    const tenantMediaClient = fakeMediaClient();
    const { fetcher, store, action } = setup({
      config: { uploadParams: { collection: 'some-tenant-collection' } },
      tenantMediaClient,
    });

    const copyFileWithToken = jest.fn().mockResolvedValue({
      data: { id: 'some-id' },
    }) as MediaStore['copyFileWithToken'];

    asMock(MediaStore).mockImplementation(() => ({
      copyFileWithToken,
    }));

    await finalizeUpload(fetcher, store, action);

    expect(copyFileWithToken).toBeCalledTimes(1);
    expectFunctionToHaveBeenCalledWith(copyFileWithToken, [
      {
        sourceFile: {
          collection: 'some-collection',
          id: 'some-file-id',
          owner: {
            id: 'some-client-id',
            token: 'some-token',
            baseUrl: 'some-base-url',
          },
        },
      },
      {
        collection: 'some-tenant-collection',
        occurrenceKey: undefined,
        replaceFileId: undefined,
      },
    ]);
    expect(tenantMediaClient.config.authProvider).toBeCalledWith({
      collectionName: 'some-tenant-collection',
    });
  });

  it('should populate cache with processed state', async () => {
    const { fetcher, store, action } = setup();
    const subject = new ReplaySubject<Partial<FileState>>(1);
    const next = jest.fn();
    subject.next({
      id: copiedFile.id,
    });
    getFileStreamsCache().set(copiedFile.id, subject as Observable<FileState>);

    await finalizeUpload(fetcher, store, action);

    const observable = getFileStreamsCache().get(copiedFile.id);
    observable!.subscribe({ next });

    // Needed due usage of setTimeout in finalizeUpload
    await new Promise(resolve => setTimeout(resolve, 1));

    expect(next).toBeCalledWith({
      id: 'some-copied-file-id',
      status: 'processed',
      artifacts: undefined,
      mediaType: undefined,
      mimeType: undefined,
      name: 'some-file-name',
      size: 12345,
    });
  });
});
