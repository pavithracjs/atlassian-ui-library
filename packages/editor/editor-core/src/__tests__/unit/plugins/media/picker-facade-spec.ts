import { MediaClientConfig } from '@atlaskit/media-core';
import {
  StoryBookAuthProvider,
  userAuthProvider,
  asMock,
} from '@atlaskit/media-test-helpers';
import { Popup } from '@atlaskit/media-picker';

import PickerFacade from '../../../../plugins/media/picker-facade';
import { ErrorReportingHandler } from '@atlaskit/editor-common';

describe('Media PickerFacade', () => {
  const errorReporter: ErrorReportingHandler = {
    captureException: () => {},
    captureMessage: () => {},
  };

  const mediaClientConfig: MediaClientConfig = {
    authProvider: StoryBookAuthProvider.create(false),
    userAuthProvider,
  };

  const pickerFacadeConfig = {
    mediaClientConfig,
    errorReporter,
  };

  const popupMediaPickerMock: Popup = {
    on: jest.fn(),
    removeAllListeners: jest.fn(),
    teardown: jest.fn(),
    show: jest.fn(),
    cancel: jest.fn(),
    hide: jest.fn(),
    emitClosed: jest.fn(),
    setUploadParams: jest.fn(),
    emitUploadsStart: jest.fn(),
    emitUploadProgress: jest.fn(),
    emitUploadPreviewUpdate: jest.fn(),
    emitUploadProcessing: jest.fn(),
    emitUploadEnd: jest.fn(),
    emitUploadError: jest.fn(),
    once: jest.fn(),
    onAny: jest.fn(),
    addListener: jest.fn(),
    off: jest.fn(),
    removeListener: jest.fn(),
    emit: jest.fn(),
  };

  describe('Picker: Popup', () => {
    let facade: PickerFacade;

    beforeEach(async () => {
      const MediaPickerMockConstructor = () =>
        Promise.resolve(popupMediaPickerMock);

      facade = new PickerFacade(
        'popup',
        pickerFacadeConfig,
        {
          uploadParams: { collection: '' },
        },
        asMock(MediaPickerMockConstructor),
      );
      await facade.init();
    });

    afterEach(() => {
      facade.destroy();
      jest.clearAllMocks();
    });

    it('listens to picker events', () => {
      expect(true).toBeTruthy();
      expect(popupMediaPickerMock.on).toHaveBeenCalledTimes(5);
      expect(popupMediaPickerMock.on).toHaveBeenCalledWith(
        'upload-preview-update',
        expect.any(Function),
      );
      expect(popupMediaPickerMock.on).toHaveBeenCalledWith(
        'upload-processing',
        expect.any(Function),
      );
      expect(popupMediaPickerMock.on).toHaveBeenCalledWith(
        'upload-end',
        expect.any(Function),
      );
    });

    it('removes listeners on destruction', () => {
      facade.destroy();
      expect(popupMediaPickerMock.removeAllListeners).toHaveBeenCalledTimes(4);
      expect(popupMediaPickerMock.removeAllListeners).toHaveBeenCalledWith(
        'upload-preview-update',
      );
      expect(popupMediaPickerMock.removeAllListeners).toHaveBeenCalledWith(
        'upload-processing',
      );
      expect(popupMediaPickerMock.removeAllListeners).toHaveBeenCalledWith(
        'upload-end',
      );
    });

    it(`should call picker's teardown() on destruction`, () => {
      facade.destroy();
      expect(popupMediaPickerMock.teardown).toHaveBeenCalledTimes(1);
    });

    it(`should call picker's show() on destruction`, () => {
      facade.show();
      expect(popupMediaPickerMock.show).toHaveBeenCalledTimes(1);
    });

    it(`should call picker's hide() on destruction`, () => {
      facade.hide();
      expect(popupMediaPickerMock.hide).toHaveBeenCalledTimes(1);
    });

    it('should call picker on close when onClose is called', () => {
      const closeCb = jest.fn();
      asMock(popupMediaPickerMock.on).mockClear();
      facade.onClose(closeCb);

      expect(popupMediaPickerMock.on).toHaveBeenCalledTimes(1);
      expect(popupMediaPickerMock.on).toHaveBeenCalledWith('closed', closeCb);
    });
  });
});
