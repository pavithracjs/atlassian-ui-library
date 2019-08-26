import { globalMediaEventEmitter } from '@atlaskit/media-client';
const globalEmitSpy = jest.spyOn(globalMediaEventEmitter, 'emit');
import {
  mockStore,
  mockWsConnectionHolder,
  mockPopupUploadEventEmitter,
} from '@atlaskit/media-test-helpers';

import {
  importFilesMiddleware,
  isRemoteService,
  importFiles,
  touchSelectedFiles,
  SelectedUploadFile,
} from '../../importFiles';
import { LocalUpload, LocalUploads } from '../../../domain';
import { RECENTS_COLLECTION } from '../../../config';
import { finalizeUpload } from '../../../actions/finalizeUpload';
import { startImport } from '../../../actions/startImport';
import { resetView } from '../../../actions/resetView';
import {
  UploadEndEvent,
  UploadPreviewUpdateEvent,
  UploadProcessingEvent,
  UploadEventName,
} from '../../../../domain/uploadEvent';
import MockContext = jest.MockContext;
import { Action, Dispatch } from 'redux';
import {
  setEventProxy,
  SetEventProxyAction,
} from '../../../actions/setEventProxy';
import { getPreview } from '../../../actions/getPreview';
import { hidePopup } from '../../../actions/hidePopup';
import { MediaFile } from '../../../../domain/file';
import {
  isSendUploadEventAction,
  SendUploadEventAction,
  SendUploadEventActionPayload,
} from '../../../actions/sendUploadEvent';
import { SCALE_FACTOR_DEFAULT } from '../../../../util/getPreviewFromImage';
import {
  getFileStreamsCache,
  FileState,
  UploadingFileState,
} from '@atlaskit/media-client';
import { ReplaySubject, Observable } from 'rxjs';

describe('importFiles middleware', () => {
  const expectUUID = expect.stringMatching(/[a-f0-9\-]+/);
  const todayDate = Date.now();
  interface SetupOptions {
    withSelectedItems: boolean;
  }
  const defaultOptions: SetupOptions = {
    withSelectedItems: true,
  };
  const makeFileData = (index: number) => ({
    id: `some-selected-item-id-${index}`,
    name: `picture${index}.jpg`,
    mimeType: 'image/jpg',
    size: 42 + index,
    occurrenceKey: `occurrence-key-${index}`,
  });

  const getSendUploadEventPayloads = (
    store: { dispatch: jest.Mock<unknown> },
    eventName: UploadEventName,
  ): SendUploadEventActionPayload[] => {
    return store.dispatch.mock.calls
      .map(args => args[0] as SendUploadEventAction)
      .filter(isSendUploadEventAction)
      .filter(({ payload: { event } }) => event.name === eventName)
      .map(({ payload }) => payload);
  };

  const getDispatchArgs = (store: any, type: string): Action[] =>
    (store.dispatch.mock as MockContext<Dispatch<any>>).calls
      .filter(args => args[0].type === type)
      .map(args => args[0]);

  const setup = (opts: Partial<SetupOptions> = {}) => {
    const { withSelectedItems } = {
      ...defaultOptions,
      ...opts,
    } as SetupOptions;

    const makeLocalUpload = (index: number, total: number): LocalUpload => {
      const files: MediaFile[] = [];

      // Each LocalUpload will have a list of events with one of them being uploads-start,
      // and each of those events will contain all UploadFiles.
      for (let i = 1; i <= total; i++) {
        const { id, name, mimeType: type, size, occurrenceKey } = makeFileData(
          i,
        );
        files.push({
          id,
          name,
          type,
          size,
          creationDate: todayDate,
          occurrenceKey,
        });
      }

      const file = files[index - 1];
      const fileWithPublicId = { ...file, publicId: `publicId-${index}` };
      const uploadProcessingEvent: UploadProcessingEvent = {
        name: 'upload-processing',
        data: {
          file: fileWithPublicId,
        },
      };

      const uploadPreviewUpdateEvent: UploadPreviewUpdateEvent = {
        name: 'upload-preview-update',
        data: {
          file,
          preview: {
            dimensions: {
              width: 10,
              height: 10,
            },
            scaleFactor: SCALE_FACTOR_DEFAULT,
          },
        },
      };

      const uploadEndEvent: UploadEndEvent = {
        name: 'upload-end',
        data: {
          file,
        },
      };

      return {
        file: {
          metadata: {
            ...makeFileData(index),
          },
        },
        events: [
          // uploads-event won't be part of events list. See fileUploadsAdd.tsx
          uploadPreviewUpdateEvent,
          uploadProcessingEvent,
          uploadEndEvent,
        ],
        index,
        progress: null,
        timeStarted: 0,
      };
    };

    const localUploads: LocalUploads = {
      'some-selected-item-id-1': makeLocalUpload(1, 3),
      'some-selected-item-id-2': makeLocalUpload(2, 3),
      'some-selected-item-id-3': makeLocalUpload(3, 3),
    };

    const store = mockStore(
      withSelectedItems
        ? {
            uploads: localUploads,
            config: {
              uploadParams: {
                collection: 'tenant-collection',
              },
            },
            selectedItems: [
              {
                serviceName: 'upload',
                ...makeFileData(1),
                accountId: '',
                date: todayDate,
              },
              // Not all uploaded files are being selected. number 2 was skipped
              {
                serviceName: 'upload',
                ...makeFileData(3),
                accountId: '',
                date: todayDate,
              },
              {
                serviceName: 'recent_files',
                ...makeFileData(4),
                accountId: '',
                date: todayDate,
              },
              {
                serviceName: 'dropbox',
                ...makeFileData(5),
                accountId: 'some-account-id',
                date: 0,
              },
            ],
          }
        : {},
    );

    const wsConnectionHolder = mockWsConnectionHolder();
    const mockWsProvider = {
      getWsConnectionHolder: jest.fn(() => wsConnectionHolder),
    } as any;
    const nextDispatch = jest.fn();

    return {
      mockWsProvider,
      wsConnectionHolder,
      store,
      nextDispatch,
      eventEmitter: mockPopupUploadEventEmitter(),
    };
  };

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should call next dispatch if action is START_IMPORT', () => {
    const { eventEmitter, mockWsProvider, store, nextDispatch } = setup();

    const action = startImport();
    importFilesMiddleware(eventEmitter, mockWsProvider)(store)(nextDispatch)(
      action,
    );
    expect(nextDispatch).toBeCalledWith(action);
  });

  it('should call next dispatch even if action is not START_IMPORT', () => {
    const { eventEmitter, mockWsProvider, store, nextDispatch } = setup();

    const action = resetView();
    importFilesMiddleware(eventEmitter, mockWsProvider)(store)(nextDispatch)(
      action,
    );
    expect(nextDispatch).toBeCalledWith(action);
  });

  describe('when START_IMPORT action supplied', () => {
    const action = startImport();

    it('should emit uploads-start event back to container for all selected items', () => {
      const { eventEmitter, mockWsProvider, store } = setup();

      return importFiles(eventEmitter, store, mockWsProvider).then(() => {
        expect(eventEmitter.emitUploadsStart).toBeCalledWith([
          {
            id: expectUUID,
            name: 'picture1.jpg',
            type: 'image/jpg',
            size: 43,
            creationDate: todayDate,
            occurrenceKey: 'occurrence-key-1',
          },
          {
            id: expectUUID,
            name: 'picture3.jpg',
            type: 'image/jpg',
            size: 45,
            creationDate: todayDate,
            occurrenceKey: 'occurrence-key-3',
          },
          {
            id: expectUUID,
            name: 'picture4.jpg',
            type: 'image/jpg',
            size: 46,
            creationDate: todayDate,
            occurrenceKey: 'occurrence-key-4',
          },
          {
            id: expectUUID,
            name: 'picture5.jpg',
            type: 'image/jpg',
            size: 47,
            creationDate: expect.any(Number),
            occurrenceKey: 'occurrence-key-5',
          },
        ]);
      });
    });

    it('should close popup', () => {
      const { eventEmitter, mockWsProvider, store, nextDispatch } = setup();
      importFilesMiddleware(eventEmitter, mockWsProvider)(store)(nextDispatch)(
        action,
      );

      expect(store.dispatch).toHaveBeenCalledWith(hidePopup());
    });

    describe('each selected and recent file', () => {
      it('should dispatch GET_PREVIEW action', () => {
        const { eventEmitter, mockWsProvider, store } = setup();

        return importFiles(eventEmitter, store, mockWsProvider).then(() => {
          expect(store.dispatch).toBeCalledWith(
            getPreview(
              expectUUID,
              {
                id: 'some-selected-item-id-4',
                name: 'picture4.jpg',
                type: 'image/jpg',
                size: 46,
                creationDate: todayDate,
                occurrenceKey: 'occurrence-key-4',
              },
              RECENTS_COLLECTION,
            ),
          );
        });
      });
    });

    describe('each selected and locally uploaded file', () => {
      it('should dispatch FINALIZE_UPLOAD action', () => {
        const { eventEmitter, mockWsProvider, store } = setup();

        return importFiles(eventEmitter, store, mockWsProvider).then(() => {
          const localUploadsFinalizedNum = 2;
          const recentFinalizedNum = 1;
          const isFinalizeUploadCall = (call: Action[]) =>
            call[0].type === 'FINALIZE_UPLOAD';

          expect(
            store.dispatch.mock.calls.filter(isFinalizeUploadCall),
          ).toHaveLength(localUploadsFinalizedNum + recentFinalizedNum);

          expect(store.dispatch).toBeCalledWith(
            expect.objectContaining({
              file: expect.objectContaining({
                name: 'picture1.jpg',
              }),
            }),
          );

          expect(store.dispatch).toBeCalledWith(
            expect.objectContaining({
              file: expect.objectContaining({
                name: 'picture3.jpg',
              }),
            }),
          );

          expect(store.dispatch).toBeCalledWith(
            finalizeUpload(
              {
                id: 'some-selected-item-id-4',
                name: 'picture4.jpg',
                type: 'image/jpg',
                size: 46,
                creationDate: todayDate,
                occurrenceKey: 'occurrence-key-4',
              },
              expectUUID,
              {
                id: 'some-selected-item-id-4',
                collection: RECENTS_COLLECTION,
              },
              expect.anything(),
            ),
          );
        });
      });

      it('should bobble up some events', done => {
        const { eventEmitter, mockWsProvider, store, nextDispatch } = setup();
        importFilesMiddleware(eventEmitter, mockWsProvider)(store)(
          nextDispatch,
        )(action);

        window.setTimeout(() => {
          const sendUploadEventsCalls = getSendUploadEventPayloads(
            store,
            'upload-preview-update',
          );

          expect(sendUploadEventsCalls).toHaveLength(2);
          let firstEvent = sendUploadEventsCalls[0]
            .event as UploadPreviewUpdateEvent;
          let secondEvent = sendUploadEventsCalls[1]
            .event as UploadPreviewUpdateEvent;
          expect(firstEvent.data.file.name).toEqual('picture1.jpg');
          expect(secondEvent.data.file.name).toEqual('picture3.jpg');
          done();
        });
      });

      it('should not bobble up other events', done => {
        const { eventEmitter, mockWsProvider, store, nextDispatch } = setup();
        importFilesMiddleware(eventEmitter, mockWsProvider)(store)(
          nextDispatch,
        )(action);

        window.setTimeout(() => {
          expect(eventEmitter.emitUploadsStart).toHaveBeenCalledTimes(1);
          expect(
            getSendUploadEventPayloads(store, 'uploads-start'),
          ).toHaveLength(0);
          expect(getSendUploadEventPayloads(store, 'upload-end')).toHaveLength(
            0,
          );
          done();
        });
      });

      it('should dispatch SET_EVENT_PROXY action', done => {
        const { eventEmitter, mockWsProvider, store, nextDispatch } = setup();
        importFilesMiddleware(eventEmitter, mockWsProvider)(store)(
          nextDispatch,
        )(action);

        window.setTimeout(() => {
          const setEventProxyCalls = getDispatchArgs(
            store,
            'SET_EVENT_PROXY',
          ) as SetEventProxyAction[];
          expect(setEventProxyCalls).toHaveLength(2);
          expect(setEventProxyCalls[0]).toEqual(
            setEventProxy('some-selected-item-id-1', expectUUID),
          );
          expect(setEventProxyCalls[1]).toEqual(
            setEventProxy('some-selected-item-id-3', expectUUID),
          );
          done();
        });
      });
    });

    describe('each selected and remote file', () => {
      it('should initiate the import with a websocket message', done => {
        const {
          eventEmitter,
          mockWsProvider,
          wsConnectionHolder,
          store,
          nextDispatch,
        } = setup();

        importFilesMiddleware(eventEmitter, mockWsProvider)(store)(
          nextDispatch,
        )(action);

        window.setTimeout(() => {
          expect(wsConnectionHolder.openConnection).toHaveBeenCalledTimes(1);
          expect(wsConnectionHolder.send).toHaveBeenCalledTimes(1);
          expect(wsConnectionHolder.send).toHaveBeenCalledWith({
            type: 'fetchFile',
            params: {
              serviceName: 'dropbox',
              accountId: 'some-account-id',
              fileId: 'some-selected-item-id-5',
              fileName: 'picture5.jpg',
              collection: RECENTS_COLLECTION,
              jobId: expectUUID,
            },
          });
          done();
        });
      });

      it('should touch all files to import', done => {
        const { eventEmitter, mockWsProvider, store, nextDispatch } = setup();

        importFilesMiddleware(eventEmitter, mockWsProvider)(store)(
          nextDispatch,
        )(action);

        window.setTimeout(() => {
          const { tenantMediaClient } = store.getState();
          expect(tenantMediaClient.file.touchFiles).toBeCalledTimes(1);
          expect(tenantMediaClient.file.touchFiles).toBeCalledWith(
            [
              {
                collection: 'tenant-collection',
                fileId: expectUUID,
                occurrenceKey: 'occurrence-key-1',
              },
              {
                collection: 'tenant-collection',
                fileId: expectUUID,
                occurrenceKey: 'occurrence-key-3',
              },
              {
                collection: 'tenant-collection',
                fileId: expectUUID,
                occurrenceKey: 'occurrence-key-4',
              },
              {
                collection: 'tenant-collection',
                fileId: expectUUID,
                occurrenceKey: 'occurrence-key-5',
              },
            ],
            'tenant-collection',
          );
          done();
        });
      });
    });

    it('should emit file-added in tenant mediaClient and globalMediaEventEmitter', done => {
      const { eventEmitter, mockWsProvider, store, nextDispatch } = setup();

      importFilesMiddleware(eventEmitter, mockWsProvider)(store)(nextDispatch)(
        action,
      );

      window.setTimeout(() => {
        const { tenantMediaClient } = store.getState();
        const fileState = {
          id: expectUUID,
          mediaType: 'image',
          mimeType: 'image/jpg',
          name: 'picture5.jpg',
          preview: undefined,
          representations: {},
          size: 47,
          status: 'processing',
        };

        expect(globalEmitSpy).toBeCalledTimes(4);
        expect(globalEmitSpy).lastCalledWith('file-added', fileState);
        expect(tenantMediaClient.emit).toBeCalledTimes(4);
        expect(tenantMediaClient.emit).lastCalledWith('file-added', fileState);
        done();
      });
    });
  });

  describe('isRemoteService', () => {
    it('should return true for service name "dropbox"', () => {
      expect(isRemoteService('dropbox')).toEqual(true);
    });

    it('should return true for service name "google"', () => {
      expect(isRemoteService('google')).toEqual(true);
    });

    it('should return false for service name other than "dropbox" or "google"', () => {
      expect(isRemoteService('recent_files')).toEqual(false);
    });
  });

  describe('touchSelectedFiles()', () => {
    const file: MediaFile = {
      id: 'id-1',
      creationDate: 1,
      name: '',
      size: 1,
      type: 'image/png',
    };
    it('should add file preview for Giphy files', done => {
      const selectedFiles: SelectedUploadFile[] = [
        {
          file,
          serviceName: 'giphy',
          touchFileDescriptor: {
            fileId: 'id-1',
          },
        },
      ];
      const store = mockStore({
        giphy: {
          imageCardModels: [
            {
              dataURI: 'giphy-preview-1',
              dimensions: { height: 1, width: 1 },
              metadata: {
                id: 'id-1',
              },
            },
            {
              dataURI: 'giphy-preview-2',
              dimensions: { height: 1, width: 1 },
              metadata: {
                id: 'id-2',
              },
            },
          ],
        },
      });
      touchSelectedFiles(selectedFiles, store);
      const observable = getFileStreamsCache().get('id-1');

      observable!.subscribe({
        next(state) {
          if (state.status !== 'error') {
            expect(state.preview).toEqual({
              value: 'giphy-preview-1',
            });
            done();
          }
        },
      });
    });

    it('should add file preview for local uploads', done => {
      const subject = new ReplaySubject<Partial<FileState>>(1);
      subject.next({
        id: 'id-1',
        status: 'processing',
        preview: {
          value: 'some-local-preview',
        },
      });
      getFileStreamsCache().set('id-1', subject as Observable<FileState>);
      const selectedFiles: SelectedUploadFile[] = [
        {
          file,
          serviceName: 'upload',
          touchFileDescriptor: {
            fileId: 'id-1',
          },
        },
      ];
      const store = mockStore();
      touchSelectedFiles(selectedFiles, store);
      const observable = getFileStreamsCache().get('id-1');

      observable!.subscribe({
        async next(state) {
          if (state.status !== 'error') {
            expect(await state.preview).toEqual({
              value: 'some-local-preview',
            });
            done();
          }
        },
      });
    });

    it('should fetch remote preview for recent files if image is previewable', done => {
      const selectedFiles: SelectedUploadFile[] = [
        {
          file,
          serviceName: 'recent_files',
          touchFileDescriptor: {
            fileId: 'id-1',
          },
        },
      ];
      const store = mockStore();
      touchSelectedFiles(selectedFiles, store);
      const observable = getFileStreamsCache().get('id-1');

      observable!.subscribe({
        async next(state) {
          if (state.status !== 'error') {
            await state.preview;
            const { userMediaClient } = store.getState();
            expect(userMediaClient.getImage).toBeCalledTimes(1);
            expect(userMediaClient.getImage).toBeCalledWith('id-1', {
              collection: RECENTS_COLLECTION,
              width: 1920,
              height: 1080,
              mode: 'fit',
            });
            done();
          }
        },
      });
    });
    it('should set value of public file id to be new file state', done => {
      const selectedFiles: SelectedUploadFile[] = [
        {
          file,
          serviceName: 'upload',
          touchFileDescriptor: {
            fileId: 'id-foo-1',
          },
        },
      ];
      const store = mockStore();
      touchSelectedFiles(selectedFiles, store);
      const observable = getFileStreamsCache().get('id-foo-1');

      observable!.subscribe({
        async next(state) {
          if (state.status !== 'error') {
            expect(await state.id).toEqual('id-foo-1');
            done();
          }
        },
      });
    });

    it('should reuse existing user file state for tenant id', done => {
      const userFile: MediaFile = {
        id: 'user-id',
        creationDate: 1,
        name: 'some_file_name',
        size: 1,
        type: 'image/png',
      };
      const selectedFiles: SelectedUploadFile[] = [
        {
          file: userFile,
          serviceName: 'upload',
          touchFileDescriptor: {
            fileId: 'tenant-upfront-id',
          },
        },
      ];

      const subject = new ReplaySubject<Partial<FileState>>(1);
      subject.next({
        id: 'user-id',
        status: 'uploading',
        name: 'some_file_name',
        progress: 0.5,
        preview: {
          value: 'some-existing-preview',
        },
      });
      getFileStreamsCache().set('user-id', subject as Observable<FileState>);

      const store = mockStore();
      touchSelectedFiles(selectedFiles, store);
      const observable = getFileStreamsCache().get('tenant-upfront-id');

      observable!.subscribe({
        async next(state) {
          const fileState = state as UploadingFileState;
          // we want to make sure that existing file properties are present
          expect(fileState.name).toEqual('some_file_name');
          expect(fileState.progress).toEqual(0.5);
          expect(await fileState.preview).toEqual({
            value: 'some-existing-preview',
          });
          done();
        },
      });
    });
  });
});
