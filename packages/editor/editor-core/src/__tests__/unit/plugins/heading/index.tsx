import { copyTextToClipboard } from '../../../../plugins/heading';

jest.mock('@atlaskit/editor-common', () => ({
  clipboardApiSupported: jest.fn(),
  copyToClipboard: jest.fn(),
  copyToClipboardLegacy: jest.fn(),
}));

import {
  clipboardApiSupported,
  copyToClipboard,
  copyToClipboardLegacy,
} from '@atlaskit/editor-common';

describe('heading', () => {
  it('returns calls copyToClipboard when clipboardApiSupported return true', () => {
    (clipboardApiSupported as jest.Mock).mockReturnValue(true);
    copyTextToClipboard('test1');
    expect(copyToClipboard).toHaveBeenCalledWith('test1');
  });

  it('returns calls copyToClipboardLegacy when clipboardApiSupported return false', () => {
    (clipboardApiSupported as jest.Mock).mockReturnValue(false);
    copyTextToClipboard('test2');
    expect(copyToClipboardLegacy).toHaveBeenCalledWith(
      'test2',
      jasmine.any(Object),
    );
  });
});
