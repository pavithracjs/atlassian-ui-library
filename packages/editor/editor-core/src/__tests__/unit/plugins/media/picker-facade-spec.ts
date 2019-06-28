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

  const popupMediaPickerMock = {
    on: jest.fn(),
    removeAllListeners: jest.fn(),
    teardown: jest.fn(),
    show: jest.fn(),
    cancel: jest.fn(),
    hide: jest.fn(),
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
      expect(popupMediaPickerMock.on).toHaveBeenCalledTimes(4);
      expect(popupMediaPickerMock.on).toHaveBeenCalledWith(
        'upload-preview-update',
        expect.any(Function),
      );
      expect(popupMediaPickerMock.on).toHaveBeenCalledWith(
        'upload-processing',
        expect.any(Function),
      );
    });

    it('removes listeners on destruction', () => {
      facade.destroy();
      expect(popupMediaPickerMock.removeAllListeners).toHaveBeenCalledTimes(3);
      expect(popupMediaPickerMock.removeAllListeners).toHaveBeenCalledWith(
        'upload-preview-update',
      );
      expect(popupMediaPickerMock.removeAllListeners).toHaveBeenCalledWith(
        'upload-processing',
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
  });
});
