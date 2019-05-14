import { snapshot, initEditorWithAdf, Appearance } from '../_utils';
import contentAdf from './__fixtures__/with-content.json';
import { parseAndInlineAdfMedia } from '@atlaskit/editor-test-helpers';
import { Page } from '../../__helpers/page-objects/_types';
import {
  waitForEmojis,
  emojiReadySelector,
} from '../../__helpers/page-objects/_emoji';
import {
  waitForLoadedImageElements,
  waitForLoadedBackgroundImages,
} from '@atlaskit/visual-regression/helper';

describe('Snapshot Test: Mobile Dark Editor', () => {
  let page: Page;

  const adf = parseAndInlineAdfMedia(contentAdf);

  beforeAll(async () => {
    // @ts-ignore
    page = global.page;
    await initEditorWithAdf(page, {
      adf,
      appearance: Appearance.mobile,
      viewport: { width: 414, height: 3000 }, // Width iPhone
      mode: 'dark',
    });
  });

  it('should correctly render dark mode in mobile editor', async () => {
    await waitForLoadedImageElements(page, 1000); // 1 second timeout for inlined media.
    await waitForEmojis(page);
    await waitForLoadedBackgroundImages(page, emojiReadySelector, 10000);
    await snapshot(page, 0.02);
  });
});
