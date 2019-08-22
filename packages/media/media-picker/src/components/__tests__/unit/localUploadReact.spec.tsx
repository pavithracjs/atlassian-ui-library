import {
  LocalUploadComponentReact,
  LocalUploadComponentBaseProps,
} from '../../localUploadReact';
import { ReactWrapper, mount } from 'enzyme';
import React from 'react';
import { MediaFile } from '../../../domain/file';
import {
  UploadEventPayloadMap,
  UploadErrorEventPayload,
  UploadEndEventPayload,
  UploadProcessingEventPayload,
  UploadStatusUpdateEventPayload,
  UploadPreviewUpdateEventPayload,
  UploadsStartEventPayload,
} from '../../../domain/uploadEvent';

jest.mock('../../../service/uploadServiceImpl');
jest.mock('../../component');

import { SCALE_FACTOR_DEFAULT } from '../../../util/getPreviewFromImage';
import { UploadComponent } from '../../component';
import { fakeMediaClient } from '@atlaskit/media-test-helpers';

const imageFile: MediaFile = {
  id: 'some-id',
  name: 'some-name',
  size: 12345,
  creationDate: Date.now(),
  type: 'image/jpg',
};

class DummyLocalUploadComponent extends LocalUploadComponentReact<
  LocalUploadComponentBaseProps
> {
  render() {
    return null;
  }
}

describe('LocalUploadReact', () => {
  let localUploadComponent: ReactWrapper<DummyLocalUploadComponent>;
  let localUploadComponentInstance: DummyLocalUploadComponent;
  const onUploadsStart = jest.fn();
  const onPreviewUpdate = jest.fn();
  const onStatusUpdate = jest.fn();
  const onProcessing = jest.fn();
  const onEnd = jest.fn();
  const onError = jest.fn();
  let uploadComponent: UploadComponent<UploadEventPayloadMap>;

  const mediaClient = fakeMediaClient();

  const config = {
    uploadParams: {},
  };

  beforeEach(() => {
    localUploadComponent = mount(
      <DummyLocalUploadComponent
        mediaClient={mediaClient}
        config={config}
        onUploadsStart={onUploadsStart}
        onPreviewUpdate={onPreviewUpdate}
        onStatusUpdate={onStatusUpdate}
        onProcessing={onProcessing}
        onEnd={onEnd}
        onError={onError}
      />,
    );

    localUploadComponentInstance = localUploadComponent.instance() as DummyLocalUploadComponent;
    uploadComponent = (localUploadComponentInstance as any).uploadComponent;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should call uploadComponent.emitUploadsStart with proper arguments', () => {
    const files: UploadsStartEventPayload = {
      files: [imageFile],
    };
    (localUploadComponentInstance as any).onFilesAdded(files);
    expect(uploadComponent.emitUploadsStart).toBeCalledWith(files.files);
  });

  it('should call uploadComponent.emitUploadPreviewUpdate with proper arguments', () => {
    const preview: UploadPreviewUpdateEventPayload = {
      file: imageFile,
      preview: {
        dimensions: {
          width: 100,
          height: 200,
        },
        scaleFactor: SCALE_FACTOR_DEFAULT,
      },
    };
    (localUploadComponentInstance as any).onFilePreviewUpdate(preview);
    expect(uploadComponent.emitUploadPreviewUpdate).toBeCalledWith(
      preview.file,
      preview.preview,
    );
  });

  it('should call uploadComponent.emitUploadProgress with proper arguments', () => {
    const progress: UploadStatusUpdateEventPayload = {
      file: imageFile,
      progress: {
        absolute: 1,
        portion: 1,
        max: 1,
        overallTime: 1,
        expectedFinishTime: 1,
        timeLeft: 1,
      },
    };
    (localUploadComponentInstance as any).onFileUploading(progress);
    expect(uploadComponent.emitUploadProgress).toBeCalledWith(
      progress.file,
      progress.progress,
    );
  });

  it('should call uploadComponent.emitUploadProcessing with proper arguments', () => {
    const processing: UploadProcessingEventPayload = {
      file: imageFile,
    };
    (localUploadComponentInstance as any).onFileConverting(processing);
    expect(uploadComponent.emitUploadProcessing).toBeCalledWith(
      processing.file,
    );
  });

  it('should call uploadComponent.emitUploadEnd with proper arguments', () => {
    const file: UploadEndEventPayload = {
      file: imageFile,
    };
    (localUploadComponentInstance as any).onFileConverted(file);
    expect(uploadComponent.emitUploadEnd).toBeCalledWith(file.file);
  });

  it('should call uploadComponent.emitUploadError with proper arguments', () => {
    const file: UploadErrorEventPayload = {
      file: imageFile,
      error: {
        name: 'object_create_fail',
        description: 'error',
      },
    };
    (localUploadComponentInstance as any).onUploadError(file);
    expect(uploadComponent.emitUploadError).toBeCalledWith(
      file.file,
      file.error,
    );
  });
});
