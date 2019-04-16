// export * from './item';
export {
  MediaItemType,
  FileItem,
  FileProcessingStatus,
  MediaArtifact,
  Artifacts,
  FileDetails,
} from '@atlaskit/media-client';

export {
  ClientBasedAuth,
  AsapBasedAuth,
  ClientAltBasedAuth,
  Auth,
  isClientBasedAuth,
  isAsapBasedAuth,
  AuthContext,
  AuthProvider,
  MediaApiConfig,
  ContextConfig,
  MediaClientConfig,
  authToOwner,
} from './auth';

export {
  UploadableFile,
  UploadFileCallbacks,
  UploadFileResult,
  UploadController,
  MediaType,
  isPreviewableType,
  TouchFileDescriptor,
  MediaFileArtifacts,
} from '@atlaskit/media-client';

export { FileFetcher } from '@atlaskit/media-client';
export * from './context/context';

// export * from './utils';
export { isImageRemote } from '@atlaskit/media-client';

// export * from './fileState';
export {
  FileStatus,
  FilePreview,
  PreviewOptions,
  GetFileOptions,
  UploadingFileState,
  ProcessingFileState,
  ProcessedFileState,
  ProcessingFailedState,
  ErrorFileState,
  FileState,
  isErrorFileState,
  isImageRepresentationReady,
  mapMediaFileToFileState,
  mapMediaItemToFileState,
} from '@atlaskit/media-client';

// export * from './utils/getMediaTypeFromMimeType';
export { getMediaTypeFromMimeType } from '@atlaskit/media-client';

// export * from './context/fileStreamCache';
import { FileState, StreamsCache } from '@atlaskit/media-client';
export type FileStreamCache = StreamsCache<FileState>;
export { fileStreamsCache } from '@atlaskit/media-client';

// export type ImageResizeMode = 'crop' | 'fit' | 'full-fit' | 'stretchy-fit';
export { ImageResizeMode } from '@atlaskit/media-client';

// export * from './identifier';
export {
  Identifier,
  FileIdentifier,
  ExternalImageIdentifier,
  isFileIdentifier,
  isExternalImageIdentifier,
  isDifferentIdentifier,
} from '@atlaskit/media-client';

export { mediaState, CachedMediaState, StateDeferredValue } from './cache';
