import { Store, Dispatch, Middleware } from 'redux';
import {
  MediaStore,
  MediaStoreCopyFileWithTokenBody,
  MediaStoreCopyFileWithTokenParams,
} from '@atlaskit/media-store';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import {
  FileState,
  MediaFile as MediaClientFile,
} from '@atlaskit/media-client';
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

// Trigers a fetch to the recently copied file, and populates the existing state with the remote one
const emitProcessedState = async (
  destinationFile: MediaClientFile,
  store: Store<State>,
) => {
  return new Promise(async resolve => {
    const { tenantMediaClient, config } = store.getState();
    const collection = config.uploadParams && config.uploadParams.collection;
    const tenantSubject = tenantMediaClient.file.getFileState(
      destinationFile.id,
    ) as ReplaySubject<FileState>;
    const response = (await tenantMediaClient.mediaStore.getItems(
      [destinationFile.id],
      collection,
    )).data;
    const firstItem = response.items[0];

    // We need this check since the return type of getFileState might not be a ReplaySubject and won't have "next"
    if (
      firstItem &&
      firstItem.details.processingStatus === 'succeeded' &&
      tenantSubject &&
      tenantSubject.next
    ) {
      const subscription = tenantSubject.subscribe({
        next(currentState) {
          setTimeout(() => subscription.unsubscribe(), 0);
          setTimeout(() => {
            const {
              artifacts,
              mediaType,
              mimeType,
              name,
              size,
              representations,
            } = firstItem.details;
            // we emit a new state which extends the existing one + the remote fields
            // fields like "artifacts" will be later on required on MV and we don't have it locally beforehand
            tenantSubject.next({
              ...currentState,
              status: 'processed',
              artifacts,
              mediaType,
              mimeType,
              name,
              size,
              representations,
            });
            resolve();
          }, 0);
        },
      });
    }
  });
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
    emitProcessedState(destinationFile.data, store);
    const tenantSubject = tenantMediaClient.file.getFileState(
      destinationFile.data.id,
    );
    const subscription = tenantSubject.subscribe({
      next: fileState => {
        setTimeout(() => subscription.unsubscribe(), 0);

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
