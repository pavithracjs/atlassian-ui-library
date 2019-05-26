import { MINIMUM_THRESHOLD } from '@atlaskit/visual-regression/helper';
import { snapshot, initEditorWithAdf, Appearance } from '../_utils';
import {
  insertMedia,
  waitForMediaToBeLoaded,
} from '../../__helpers/page-objects/_media';
import {
  clickToolbarMenu,
  ToolbarMenuItem,
} from '../../__helpers/page-objects/_toolbar';
import { clickEditableContent } from '../../__helpers/page-objects/_editor';
import { pressKey } from '../../__helpers/page-objects/_keyboard';
import { scrollToTable } from '../../__helpers/page-objects/_table';

describe('Snapshot Test: Media', () => {
  describe('full page editor', () => {
    let page: any;
    beforeEach(async () => {
      // @ts-ignore
      page = global.page;

      await initEditorWithAdf(page, {
        appearance: Appearance.fullPage,
      });

      // click into the editor
      await clickEditableContent(page);
    });

    describe('Tables', async () => {
      it('can insert into second row', async () => {
        await clickToolbarMenu(page, ToolbarMenuItem.table);

        // second cell
        await pressKey(page, 'ArrowDown');

        // now we can insert media as necessary
        await insertMedia(page);
        await waitForMediaToBeLoaded(page);
        await scrollToTable(page);

        await snapshot(page, MINIMUM_THRESHOLD);
      });
    });
  });

  describe('comment editor', () => {
    let page: any;
    beforeEach(async () => {
      // @ts-ignore
      page = global.page;

      await initEditorWithAdf(page, {
        appearance: Appearance.comment,
      });

      // click into the editor
      await clickEditableContent(page);
    });

    describe('Tables', async () => {
      it('can insert into second row', async () => {
        await clickToolbarMenu(page, ToolbarMenuItem.table);

        // second cell
        await pressKey(page, 'ArrowDown');

        // now we can insert media as necessary
        await insertMedia(page);
        await waitForMediaToBeLoaded(page);

        await snapshot(page, MINIMUM_THRESHOLD);
      });
    });
  });
});
