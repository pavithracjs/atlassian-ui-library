import { snapshot, initFullPageEditorWithAdf, Device } from '../_utils';
import {
  clickEditableContent,
  typeInEditor,
} from '../../__helpers/page-objects/_editor';
import {
  insertMedia,
  waitForMediaToBeLoaded,
  resizeMediaInPosition,
} from '../../__helpers/page-objects/_media';
import * as panelList from './__fixtures__/panel-list-adf.json';
import { Page } from '../../__helpers/page-objects/_types';

describe('Snapshot Test: Media', () => {
  let page: Page;
  beforeEach(async () => {
    // @ts-ignore
    page = global.page;
  });

  describe('Lists', async () => {
    beforeEach(async () => {
      await initFullPageEditorWithAdf(page, {}, Device.LaptopHiDPI);
      await clickEditableContent(page);
    });

    it('can insert a media single inside a bullet list', async () => {
      await typeInEditor(page, '* ');

      // now we can insert media as necessary
      await insertMedia(page);
      await waitForMediaToBeLoaded(page);

      await snapshot(page);
    });

    it('can insert a media single inside a numbered list', async () => {
      // type some text
      await typeInEditor(page, '1. ');

      // now we can insert media as necessary
      await insertMedia(page);
      await waitForMediaToBeLoaded(page);

      await snapshot(page);
    });
  });

  // TODO: Convert to integration test (https://product-fabric.atlassian.net/browse/ED-6692)
  describe('Lists in panels', async () => {
    beforeEach(async () => {
      await initFullPageEditorWithAdf(page, panelList, Device.LaptopHiDPI);
      await clickEditableContent(page);
    });

    it('can be resized in a list in a panel', async () => {
      await resizeMediaInPosition(page, 0, 300);
      await snapshot(page);
    });
  });
});
