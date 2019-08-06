import { Store, Dispatch, Middleware } from 'redux';
import {
  MediaStore,
  MediaStoreCopyFileWithTokenBody,
  MediaStoreCopyFileWithTokenParams,
} from '@atlaskit/media-store';
import { getFileStreamsCache, FileState } from '@atlaskit/media-client';
import { ReplaySubject } from 'rxjs/ReplaySubject';
import { Fetcher } from '../tools/fetcher/fetcher';
import {
  FinalizeUploadAction,
  isFinalizeUploadAction,
} from '../actions/finalizeUpload';
import { State, SourceFile } from '../domain';
import { mapAuthToSourceFileOwner } from '../domain/source-file';
import { MediaFile } from '../../domain/file';
import {
  sendUploadEvent,
  SendUploadEventAction,
} from '../actions/sendUploadEvent';

export default function(fetcher: Fetcher): Middleware {
  return store => (next: Dispatch<State>) => (action: any) => {
    if (isFinalizeUploadAction(action)) {
      finalizeUpload(fetcher, store as any, action);
    }
    return next(action);
  };
}

export function finalizeUpload(
  fetcher: Fetcher,
  store: Store<State>,
  { file, uploadId, source, replaceFileId }: FinalizeUploadAction,
): Promise<SendUploadEventAction> {
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
        fetcher,
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
  fetcher: Fetcher;
  file: MediaFile;
  uploadId: string;
  sourceFile: SourceFile;
  replaceFileId?: Promise<string> | string;
};

async function copyFile({
  store,
  fetcher,
  file,
  uploadId,
  sourceFile,
  replaceFileId,
}: CopyFileParams): Promise<SendUploadEventAction> {
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

  return mediaStore
    .copyFileWithToken(body, params)
    .then(async destinationFile => {
      const { id: publicId } = destinationFile.data;

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
      const auth = await tenantMediaClient.config.authProvider({
        collectionName: collection,
      });
      // TODO [MS-725]: replace by context.getFile
      return fetcher.pollFile(auth, publicId, collection);
    })
    .then(processedDestinationFile => {
      const subject = getFileStreamsCache().get(
        processedDestinationFile.id,
      ) as ReplaySubject<FileState>;
      // We need to cast to ReplaySubject and check for "next" method since the current
      if (subject && subject.next) {
        const subscription = subject.subscribe({
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
              } = processedDestinationFile;
              subject.next({
                ...currentState,
                status: 'processed',
                artifacts,
                mediaType,
                mimeType,
                name,
                size,
                representations,
              });
            }, 0);
          },
        });
      }
      return store.dispatch(
        sendUploadEvent({
          event: {
            name: 'upload-end',
            data: {
              file,
              public: processedDestinationFile,
            },
          },
          uploadId,
        }),
      );
    })
    .catch(error => {
      return store.dispatch(
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
}
