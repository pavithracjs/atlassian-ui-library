import {
  FileState,
  globalMediaEventEmitter,
  AttachmentViewedEventPayload,
} from '@atlaskit/media-client';

const fileAddedListener = (fileState: FileState) => {
  // eslint-disable-next-line no-console
  console.log('file-added -> globalMediaEventEmitter', { fileState });
};

const attachmentViewedListener = (payload: AttachmentViewedEventPayload) => {
  // eslint-disable-next-line no-console
  console.log('attachment-viewed -> c', { payload });
};

export const addGlobalEventEmitterListeners = () => {
  globalMediaEventEmitter.off('file-added', fileAddedListener);
  globalMediaEventEmitter.off('attachment-viewed', attachmentViewedListener);
  globalMediaEventEmitter.on('file-added', fileAddedListener);
  globalMediaEventEmitter.on('attachment-viewed', attachmentViewedListener);
};
