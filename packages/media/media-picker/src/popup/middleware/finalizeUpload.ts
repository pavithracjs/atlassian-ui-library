import { Store, Dispatch, Middleware } from 'redux';
import {
  MediaStore,
  MediaStoreCopyFileWithTokenBody,
  MediaStoreCopyFileWithTokenParams,
} from '@atlaskit/media-store';
import {
  FinalizeUploadAction,
  isFinalizeUploadAction,
} from '../actions/finalizeUpload';
import { State, SourceFile } from '../domain';
import { mapAuthToSourceFileOwner } from '../domain/source-file';
import { MediaFile } from '../../domain/file';
import { sendUploadEvent } from '../actions/sendUploadEvent';
import { resetView } from '../actions';
import { UploadEndEvent } from '../../domain/uploadEvent';

export default function(): Middleware {
  return store => (next: Dispatch<State>) => (action: any) => {
    if (isFinalizeUploadAction(action)) {
      finalizeUpload(store as any, action);
    }
    return next(action);
  };
}

export function finalizeUpload(
  store: Store<State>,
  { file, uploadId, source, replaceFileId }: FinalizeUploadAction,
) {
  const { userMediaClient } = store.getState();
  return userMediaClient.config
    .authProvider()
    .then(mapAuthToSourceFileOwner)
    .then(owner => {
      const sourceFile = {
        ...source,
        owner,
      };
      const copyFileParams: CopyFileParams = {
        store,
        file,
        uploadId,
        sourceFile,
        replaceFileId,
      };

      return copyFile(copyFileParams);
    });
}

type CopyFileParams = {
  store: Store<State>;
  file: MediaFile;
  uploadId: string;
  sourceFile: SourceFile;
  replaceFileId?: Promise<string> | string;
};

async function copyFile({
  store,
  file,
  uploadId,
  sourceFile,
  replaceFileId,
}: CopyFileParams) {
  const { tenantMediaClient, config } = store.getState();
  const collection = config.uploadParams && config.uploadParams.collection;
  const mediaStore = new MediaStore({
    authProvider: tenantMediaClient.config.authProvider,
  });
  const body: MediaStoreCopyFileWithTokenBody = {
    sourceFile,
  };
  const params: MediaStoreCopyFileWithTokenParams = {
    collection,
    replaceFileId: replaceFileId ? await replaceFileId : undefined,
    occurrenceKey: file.occurrenceKey,
  };

  try {
    const destinationFile = await mediaStore.copyFileWithToken(body, params);
    const tenantSubject = tenantMediaClient.file.getFileState(
      destinationFile.data.id,
    );

    tenantSubject.subscribe({
      next: fileState => {
        if (fileState.status === 'processing') {
          store.dispatch(
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
        } else if (fileState.status === 'processed') {
          store.dispatch(
            sendUploadEvent({
              event: {
                name: 'upload-end',
                data: {
                  file,
                },
              } as UploadEndEvent,
              uploadId,
            }),
          );
        } else if (
          fileState.status === 'failed-processing' ||
          fileState.status === 'error'
        ) {
          store.dispatch(
            sendUploadEvent({
              event: {
                name: 'upload-error',
                data: {
                  file,
                  error: {
                    name: 'object_create_fail',
                    description: 'There was an error while uploading a file',
                  },
                },
              },
              uploadId,
            }),
          );
        }
      },
    });
  } catch (error) {
    store.dispatch(
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
  } finally {
    store.dispatch(resetView());
  }
}
