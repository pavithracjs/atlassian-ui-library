import { MediaClientConfig } from '@atlaskit/media-core';
import {
  StoryBookAuthProvider,
  userAuthProvider,
  asMock,
} from '@atlaskit/media-test-helpers';

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

  const spies: Record<string, jest.Mock> = {
    addListener: jest.fn(),
    cancel: jest.fn(),
    emit: jest.fn(),
    emitUploadEnd: jest.fn(),
    emitUploadError: jest.fn(),
    emitUploadPreviewUpdate: jest.fn(),
    emitUploadProcessing: jest.fn(),
    emitUploadProgress: jest.fn(),
    emitUploadsStart: jest.fn(),
    off: jest.fn(),
    on: jest.fn(),
    onAny: jest.fn(),
    once: jest.fn(),
    removeAllListeners: jest.fn(),
    removeListener: jest.fn(),
    setUploadParams: jest.fn(),
    teardown: jest.fn(),
    show: jest.fn(),
    hide: jest.fn(),
    emitClosed: jest.fn(),
  };

  describe('Picker: Popup', () => {
    let facade: PickerFacade;

    beforeEach(async () => {
      Object.keys(spies).forEach(k => asMock(spies[k]).mockClear());

      class MockPopup {
        constructor() {
          (Object.keys(spies) as Array<keyof typeof spies>).forEach(
            k => ((this as any)[k] = spies[k]),
          );
        }
      }

      const MediaPickerMock = jest
        .fn()
        .mockReturnValue(Promise.resolve(new MockPopup()));

      facade = new PickerFacade(
        'popup',
        pickerFacadeConfig,
        {
          uploadParams: { collection: '' },
        },
        MediaPickerMock,
      );
      await facade.init();
    });

    afterEach(() => {
      facade.destroy();
    });

    it('listens to picker events', () => {
      const fn = jasmine.any(Function);
      expect(spies.on).toHaveBeenCalledTimes(4);
      expect(spies.on).toHaveBeenCalledWith('upload-preview-update', fn);
      expect(spies.on).toHaveBeenCalledWith('upload-processing', fn);
    });

    it('removes listeners on destruction', () => {
      facade.destroy();
      expect(spies.removeAllListeners).toHaveBeenCalledTimes(3);
      expect(spies.removeAllListeners).toHaveBeenCalledWith(
        'upload-preview-update',
      );
      expect(spies.removeAllListeners).toHaveBeenCalledWith(
        'upload-processing',
      );
    });

    it(`should call picker's teardown() on destruction`, () => {
      facade.destroy();
      expect(spies.teardown).toHaveBeenCalledTimes(1);
    });

    it(`should call picker's show() on destruction`, () => {
      facade.show();
      expect(spies.show).toHaveBeenCalledTimes(1);
    });

    it(`should call picker's hide() on destruction`, () => {
      facade.hide();
      expect(spies.hide).toHaveBeenCalledTimes(1);
    });
  });
});
