import { AuthProvider, ContextFactory } from '@atlaskit/media-core';
import { MediaPicker } from '../..';
import { ClipboardImpl } from '../../components/clipboard';

describe('MediaPicker', () => {
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
  });
});
