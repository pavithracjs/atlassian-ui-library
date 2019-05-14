import { snapshot, initFullPageEditorWithAdf, Device } from '../_utils';
import {
  clickEditableContent,
  typeInEditor,
} from '../../__helpers/page-objects/_editor';
import {
  insertMedia,
  waitForMediaToBeLoaded,
  resizeMediaInPosition,
  scrollToMedia,
} from '../../__helpers/page-objects/_media';
import panelListAdf from './__fixtures__/panel-list-adf.json';
import { parseAndInlineAdfMedia } from '@atlaskit/editor-test-helpers';
import { waitForLoadedImageElements } from '@atlaskit/visual-regression/helper';
import { Page } from '../../__helpers/page-objects/_types';

describe('Snapshot Test: Media', () => {
  let page: Page;
  beforeEach(async () => {
    // @ts-ignore
    page = global.page;
  });

  // TODO: Fix image resizing logic then unskip: https://product-fabric.atlassian.net/browse/ED-6853
  describe.skip('Lists', async () => {
    beforeEach(async () => {
      await initFullPageEditorWithAdf(page, {}, Device.LaptopHiDPI);
      await clickEditableContent(page);
    });

    it('can insert a media single inside a bullet list', async () => {
      await typeInEditor(page, '* ');

      // now we can insert media as necessary
      await insertMedia(page);
      await scrollToMedia(page);
      await waitForMediaToBeLoaded(page);

      await snapshot(page);
    });

    it('can insert a media single inside a numbered list', async () => {
      // type some text
      await typeInEditor(page, '1. ');

      // now we can insert media as necessary
      await insertMedia(page);
      await scrollToMedia(page);
      await waitForMediaToBeLoaded(page);

      await snapshot(page);
    });
  });

  // TODO: Convert to integration test (https://product-fabric.atlassian.net/browse/ED-6692)
  describe('Lists in panels', async () => {
    const adf = parseAndInlineAdfMedia(panelListAdf);

    beforeEach(async () => {
      await initFullPageEditorWithAdf(page, adf, Device.LaptopHiDPI);
      await clickEditableContent(page);
      await waitForLoadedImageElements(page, 1000); // 1 second timeout for inlined media.
    });

    it('can be resized in a list in a panel', async () => {
      await resizeMediaInPosition(page, 0, 300);
      await snapshot(page);
    });
  });
});
