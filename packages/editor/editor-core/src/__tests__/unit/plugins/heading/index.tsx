import { copyHeadingAnchorLink } from '../../../../plugins/heading';

jest.mock('@atlaskit/editor-common/src/utils/copy-to-clipboard', () => ({
  clipboardApiSupported: jest.fn(),
  copyToClipboard: jest.fn(),
  copyToClipboardLegacy: jest.fn(),
}));

import {
  clipboardApiSupported,
  copyToClipboard,
  copyToClipboardLegacy,
} from '@atlaskit/editor-common/src/utils/copy-to-clipboard';
import { asMock } from '../../../../../../../media/media-test-helpers/src';

describe('heading', () => {
  it('returns calls copyToClipboard when clipboardApiSupported return true', () => {
    asMock(clipboardApiSupported).mockReturnValue(true);
    copyHeadingAnchorLink('test1');
    expect(copyToClipboard).toHaveBeenCalledWith('http://localhost/#test1');
  });

  it('returns calls copyToClipboardLegacy when clipboardApiSupported return false', () => {
    asMock(clipboardApiSupported).mockReturnValue(false);
    copyHeadingAnchorLink('test2');
    expect(copyToClipboardLegacy).toHaveBeenCalledWith(
      'http://localhost/#test2',
      jasmine.any(Object),
    );
  });
});
