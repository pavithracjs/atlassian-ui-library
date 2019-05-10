import { AuthProvider, ContextFactory } from '@atlaskit/media-core';
import { MediaPicker } from '../..';
import { PopupImpl } from '../../components/popup';
import { BinaryUploaderImpl } from '../../components/binary';
import { BrowserImpl } from '../../components/browser';
import { ClipboardImpl } from '../../components/clipboard';
import { PopupConfig } from '../../components/types';

/**
 * These specs should describe the public API.
 */
describe('MediaPicker', () => {
  const container = document.createElement('div');
  const userAuthProvider: AuthProvider = () =>
    Promise.resolve({
      clientId: 'some-client-id',
      token: 'some-token',
      baseUrl: 'some-api-url',
    });
  const context = ContextFactory.create({
    userAuthProvider,
    authProvider: () =>
      Promise.resolve({
        clientId: 'some-client-id',
        token: 'some-token',
        baseUrl: 'some-api-url',
      }),
  });
  const config = {
    uploadParams: {
      collection: 'some-collection',
    },
  };

  describe('binary', () => {
    it('should be instance of MediaPickerBinaryUploader given options', async () => {
      const binary = await MediaPicker('binary', context, config);

      expect(binary).toBeInstanceOf(BinaryUploaderImpl);
    });

    it('should be able to register listeners to generic upload events', async () => {
      const binary = await MediaPicker('binary', context, config);
      binary.on('upload-status-update', () => {});
      binary.on('upload-preview-update', () => {});
      binary.on('upload-processing', () => {});
      binary.on('upload-end', () => {});
      binary.on('upload-error', () => {});
    });
  });

  describe('browser', () => {
    it('should be instance of MediaPickerBrowser given just module config', async () => {
      const browser = await MediaPicker('browser', context, config);

      expect(browser).toBeInstanceOf(BrowserImpl);
    });

    it('should be instance of MediaPickerBrowser given moduleConfig and pickerConfig', async () => {
      const browser = await MediaPicker('browser', context, {
        ...config,
        multiple: true,
        fileExtensions: ['image/jpeg', 'image/png'],
      });

      expect(browser).toBeInstanceOf(BrowserImpl);
    });

    // it('should be a class constructor given no options', () => {
    //   expect(MediaPicker('browser')).toEqual(Browser);
    // });

    it('should be able to register listeners to generic upload events', async () => {
      const browser = await MediaPicker('browser', context, config);

      browser.on('uploads-start', () => {});
      browser.on('upload-status-update', () => {});
      browser.on('upload-preview-update', () => {});
      browser.on('upload-processing', () => {});
      browser.on('upload-end', () => {});
      browser.on('upload-error', () => {});
    });
  });

  describe('clipboard', () => {
    it('should be instance of MediaPickerClipboard given options', async () => {
      const clipboard = await MediaPicker('clipboard', context, config);

      expect(clipboard).toBeInstanceOf(ClipboardImpl);
      expect(ClipboardImpl.instances).toHaveLength(0);
    });

    it('should stack instances when activated', async () => {
      const clipboard1 = await MediaPicker('clipboard', context, config);

      await clipboard1.activate();
      expect(ClipboardImpl.instances).toHaveLength(1);

      const clipboard2 = await MediaPicker('clipboard', context, config);

      await clipboard2.activate();
      expect(ClipboardImpl.instances).toHaveLength(2);
      expect(ClipboardImpl.latestInstance).toEqual(clipboard2);
    });

    it('should send event to latest instance only of stack', async () => {
      const clipboard1 = await MediaPicker('clipboard', context, config);
      (clipboard1 as any).onFilesPasted = jest.fn();
      await clipboard1.activate();

      const clipboard2 = await MediaPicker('clipboard', context, config);
      (clipboard2 as any).onFilesPasted = jest.fn();
      await clipboard2.activate();

      const mockEvent = {
        clipboardData: {
          types: [],
          files: [],
        },
      };
      ClipboardImpl.handleEvent(mockEvent as any);
      expect((clipboard1 as any).onFilesPasted).not.toHaveBeenCalled();
      expect((clipboard2 as any).onFilesPasted).toHaveBeenCalled();
    });

    // it('should be a class constructor given no options', () => {
    //   expect(MediaPicker('clipboard')).toEqual(Clipboard);
    // });

    it('should be able to register listeners to generic upload events', async () => {
      const clipboard = await MediaPicker('clipboard', context, config);

      clipboard.on('uploads-start', () => {});
      clipboard.on('upload-status-update', () => {});
      clipboard.on('upload-preview-update', () => {});
      clipboard.on('upload-processing', () => {});
      clipboard.on('upload-end', () => {});
      clipboard.on('upload-error', () => {});
    });
  });

  describe('popup', () => {
    const popupConfig: PopupConfig = { ...config, container };

    it('should be instance of MediaPickerPopup given options', async () => {
      const popup = await MediaPicker('popup', context, popupConfig);

      expect(popup).toBeInstanceOf(PopupImpl);
    });

    // it('should be a class constructor given no options', () => {
    //   expect(MediaPicker('popup')).toEqual(PopupImpl);
    // });

    it('should be able to register listeners to generic upload events', async () => {
      const popup = await MediaPicker('popup', context, popupConfig);

      popup.on('uploads-start', () => {});
      popup.on('upload-status-update', () => {});
      popup.on('upload-preview-update', () => {});
      popup.on('upload-processing', () => {});
      popup.on('upload-end', () => {});
      popup.on('upload-error', () => {});
    });
  });
});
