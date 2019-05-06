import {
  ErrorFileState,
  FilePreview,
  FileState,
  MediaFileArtifacts,
  MediaRepresentations,
  MediaType,
  ProcessedFileState,
  ProcessingFailedState,
  ProcessingFileState,
  UploadingFileState,
} from '@atlaskit/media-client';

/**
 *  This test is a safety net that should prevent us from making any forward and backward breaking
 *  changes in ANYTHING inside FileState interface. This interface is what being stored in media-core
 *  cache. Since there could be different versions of media-client (where FileState lives) at the same time
 *  using same cache we can't have any breaking changes. This includes adding new required fields or
 *  removing any required fields.
 *
 *  PLEASE! Thing twice if you need to change anything in this test. This has potential breaking production.
 */

describe('Cached Value Backward Compatibility', () => {
  const mediaTypes: MediaType[] = ['image', 'audio', 'doc', 'video', 'unknown'];

  const filePreviews: FilePreview[] = [
    {
      value: 'some-value',
    },
    {
      value: new Blob([]),
    },
    {
      value: new Blob([]),
    },
    {
      value: new Blob([]),
      originalDimensions: {
        height: 42,
        width: 42,
      },
    },
  ];

  const representationss: MediaRepresentations[] = [
    {},
    {
      image: { something: 'random' },
    },
  ];

  const mediaFileArtifactss: MediaFileArtifacts[] = [
    {},
    {
      'video_1280.mp4': {
        url: 'some-url',
        processingStatus: 'pending',
      },
    },
    {
      'video_640.mp4': {
        url: 'some-url',
        processingStatus: 'succeeded',
      },
    },
    {
      'document.pdf': {
        url: 'some-url',
        processingStatus: 'failed',
      },
    },
    {
      'audio.mp3': {
        url: 'some-url',
        processingStatus: 'pending',
      },
    },
  ];

  const verifyMediaTypeProperty = (
    base:
      | UploadingFileState
      | ProcessingFileState
      | ProcessedFileState
      | ProcessingFailedState,
  ) => {
    mediaTypes.forEach(mediaType => {
      const fileState: FileState = {
        ...base,
        mediaType,
      };
      expect(fileState).toEqual({
        ...base,
        mediaType,
      });
    });
  };

  const verifyRepresentationsProperty = (
    base: ProcessingFileState | ProcessedFileState | ProcessingFailedState,
  ) => {
    representationss.forEach(representations => {
      const fileState: FileState = {
        ...base,
        representations,
      };
      expect(fileState).toEqual({
        ...base,
        representations,
      });
    });
  };

  const verifyPreviewProperty = (
    base:
      | UploadingFileState
      | ProcessingFileState
      | ProcessedFileState
      | ProcessingFailedState,
  ) => {
    filePreviews.forEach(preview => {
      const fileState: FileState = {
        ...base,
        preview,
      };
      expect(fileState).toEqual({
        ...base,
        preview,
      });

      const fileState2: FileState = {
        ...base,
        preview: Promise.resolve(preview),
      };

      expect(fileState2).toEqual({
        ...base,
        preview: expect.any(Promise),
      });
    });
  };

  const verifyArtifactsProperty = (
    base: ProcessingFileState | ProcessedFileState | ProcessingFailedState,
  ) => {
    mediaFileArtifactss.forEach(artifacts => {
      const fileState: FileState = {
        ...base,
        artifacts,
      };
      expect(fileState).toEqual({
        ...base,
        artifacts,
      });
    });
  };

  describe('with UploadingFileState', () => {
    it('should not be broken', () => {
      const uploadingFileState: UploadingFileState = {
        status: 'uploading',
        id: 'some-id',
        name: 'some-name',
        size: 42,
        progress: 0.5,
        mediaType: 'image',
        mimeType: 'some-mime-type',
      };

      const uploadFileStateWithOptionalFields: UploadingFileState = {
        ...uploadingFileState,
        occurrenceKey: 'some-occurrence-key',
        preview: filePreviews[0],
      };

      verifyMediaTypeProperty(uploadingFileState);
      verifyPreviewProperty(uploadFileStateWithOptionalFields);
    });
  });

  describe('with ProcessingFileState', () => {
    it('should not be broken', () => {
      const processingFileState: ProcessingFileState = {
        status: 'processing',
        id: 'some-id',
        name: 'some-name',
        size: 42,
        mimeType: 'some-mime-type',
        mediaType: 'image',
      };
      const processingFileStateWithOptionalFields: ProcessingFileState = {
        ...processingFileState,
        occurrenceKey: 'some-occurrence-key',
        preview: filePreviews[0],
        representations: representationss[0],
        artifacts: mediaFileArtifactss[0],
      };

      verifyMediaTypeProperty(processingFileState);
      verifyPreviewProperty(processingFileStateWithOptionalFields);
      verifyRepresentationsProperty(processingFileStateWithOptionalFields);
      verifyArtifactsProperty(processingFileStateWithOptionalFields);
    });
  });

  describe('with ProcessedFileState', () => {
    it('should not be broken', () => {
      const processedFileState: ProcessedFileState = {
        status: 'processed',
        id: 'some-id',
        name: 'some-name',
        size: 42,
        mimeType: 'some-mime-type',
        mediaType: 'image',
        artifacts: mediaFileArtifactss[0],
      };
      const processedFileStateWithOptionalFields: ProcessedFileState = {
        ...processedFileState,
        occurrenceKey: 'some-occurrence-key',
        preview: filePreviews[0],
        representations: representationss[0],
      };

      verifyMediaTypeProperty(processedFileState);
      verifyArtifactsProperty(processedFileState);
      verifyPreviewProperty(processedFileStateWithOptionalFields);
      verifyRepresentationsProperty(processedFileStateWithOptionalFields);
    });
  });

  describe('with ProcessingFailedState', () => {
    it('should not be broken', () => {
      const processingFailedState: ProcessingFailedState = {
        status: 'failed-processing',
        id: 'some-id',
        name: 'some-name',
        size: 42,
        mimeType: 'some-mime-type',
        mediaType: 'image',
        artifacts: { someObject: true },
      };
      const processingFailedStateWithOptionalFields: ProcessingFailedState = {
        ...processingFailedState,
        occurrenceKey: 'some-occurrence-key',
        preview: filePreviews[0],
        representations: representationss[0],
      };
      verifyMediaTypeProperty(processingFailedState);
      verifyPreviewProperty(processingFailedStateWithOptionalFields);
      verifyRepresentationsProperty(processingFailedStateWithOptionalFields);
    });
  });

  describe('with ErrorFileState', () => {
    it('should not be broken', () => {
      const errorFileState: ErrorFileState = {
        status: 'error',
        id: 'some-id',
      };
      const errorFileStateStateWithOptionalFields: ErrorFileState = {
        ...errorFileState,
        occurrenceKey: 'some-occurrence-key',
        message: 'some-message',
      };

      expect(errorFileState).toEqual({
        status: 'error',
        id: 'some-id',
      });

      expect(errorFileStateStateWithOptionalFields).toEqual({
        status: 'error',
        id: 'some-id',
        occurrenceKey: 'some-occurrence-key',
        message: 'some-message',
      });
    });
  });
});
