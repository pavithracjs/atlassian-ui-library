import {
  clipboardApiSupported,
  copyToClipboard,
  copyToClipboardLegacy,
} from '../../../utils/copy-to-clipboard';

describe('@atlaskit/editor-core clipboard utils', () => {
  describe('clipboardApiSupported', () => {
    const oldClipboard = navigator.clipboard;
    beforeEach(() => {
      Object.defineProperty(navigator, 'clipboard', {
        value: {},
        writable: true,
      });
    });

    afterAll(() => {
      Object.defineProperty(navigator, 'clipboard', {
        value: oldClipboard,
      });
    });

    it('returns false when clipboard is defined but writeText is not a function', () => {
      delete navigator.clipboard.writeText;
      expect(clipboardApiSupported()).toEqual(false);
    });

    it('returns true when clipboard.writeText is defined', () => {
      Object.defineProperty(navigator, 'clipboard', {
        value: {
          writeText: (_s: string) => Promise.resolve(),
        },
      });
      expect(clipboardApiSupported()).toEqual(true);
    });
  });

  describe('copyToClipboardLegacy', () => {
    const oldCxecCommand = document.execCommand;
    const copyArea = document.createElement('div');

    afterEach(() => {
      document.execCommand = oldCxecCommand;
    });

    it('promise rejected when copy area is not defined', () => {
      expect(copyToClipboardLegacy('test', null)).rejects.toEqual(
        'Copy area reference is not defined',
      );
    });

    it('promise rejected when document.execCommand returns false', () => {
      document.execCommand = jest.fn(() => false);
      expect(copyToClipboardLegacy('test', copyArea)).rejects.toEqual(
        'Failed to copy',
      );
    });

    it('promise resolved when document.execCommand returns true', () => {
      document.execCommand = jest.fn(() => true);
      expect(copyToClipboardLegacy('test', copyArea)).resolves.toEqual(
        undefined,
      );
    });
  });

  describe('copyToClipboard', () => {
    const oldClipboard = navigator.clipboard;
    beforeEach(() => {
      Object.defineProperty(navigator, 'clipboard', {
        value: {},
        writable: true,
      });
    });

    afterAll(() => {
      Object.defineProperty(navigator, 'clipboard', {
        value: oldClipboard,
      });
    });

    it('returns true when clipboard.writeText is defined', () => {
      delete navigator.clipboard.writeText;
      expect(copyToClipboard('test')).rejects.toEqual(
        'Clipboard api is not supported',
      );
    });
  });
});
