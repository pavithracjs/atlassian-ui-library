import { snapshot, Appearance, initEditorWithAdf, Device } from '../_utils';
import {
  insertMedia,
  scrollToMedia,
} from '../../__helpers/page-objects/_media';
import { clickEditableContent } from '../../__helpers/page-objects/_editor';
import { pressKey } from '../../__helpers/page-objects/_keyboard';

describe('Snapshot Test: Media', () => {
  describe('full page editor', () => {
    let page: any;
    beforeEach(async () => {
      // @ts-ignore
      page = global.page;

      await initEditorWithAdf(page, {
        appearance: Appearance.fullPage,
        device: Device.LaptopHiDPI,
      });

      // click into the editor
      await clickEditableContent(page);

      // insert single media item
      await insertMedia(page);
      // Move mouse out of the page to not create fake cursor
      await page.mouse.move(-1, -1);
    });

    afterEach(async () => {
      await scrollToMedia(page);
      await snapshot(page);
    });

    it('should renders selection ring around media (via up)', async () => {
      await pressKey(page, 'ArrowUp');
    });

    it('should render right side gap cursor (via arrow left)', async () => {
      await pressKey(page, 'ArrowLeft');
    });

    it('renders selection ring around media (via 2 arrow left)', async () => {
      await pressKey(page, ['ArrowLeft', 'ArrowLeft']);
    });

    it('should render left side gap cursor (via 3 arrow left)', async () => {
      await pressKey(page, ['ArrowLeft', 'ArrowLeft', 'ArrowLeft']);
    });
  });

  describe('comment editor', () => {
    let page: any;
    const editorTestOptions = {
      appearance: Appearance.comment,
      device: Device.LaptopHiDPI,
    };

    describe('media group', () => {
      beforeEach(async () => {
        // @ts-ignore
        page = global.page;
        await initEditorWithAdf(page, editorTestOptions);

        // click into the editor
        await clickEditableContent(page);

        // insert 3 media items
        await insertMedia(page, ['one.svg', 'two.svg', 'three.svg']);
      });

      it('renders selection ring around last media group item (via up)', async () => {
        await snapshot(page);

        await pressKey(page, 'ArrowUp');
        await snapshot(page);
      });

      it('renders selection ring around media group items', async () => {
        await snapshot(page);

        await pressKey(page, ['ArrowLeft', 'ArrowLeft']);
        await snapshot(page);

        await pressKey(page, 'ArrowLeft');
        await snapshot(page);

        await pressKey(page, 'ArrowLeft');
        await snapshot(page);
      });
    });

    describe('media single', () => {
      beforeEach(async () => {
        // @ts-ignore
        page = global.page;
        await initEditorWithAdf(page, {
          ...editorTestOptions,
          editorProps: {
            media: {
              allowMediaSingle: true,
            },
          },
        });

        // insert single media item
        await insertMedia(page);

        // Move mouse out of the page to not create fake cursor
        await page.mouse.move(-1, -1);
      });

      afterEach(async () => {
        await scrollToMedia(page);
        await snapshot(page);
      });

      it('should renders selection ring around media (via up)', async () => {
        await pressKey(page, 'ArrowUp');
      });

      it('should render right side gap cursor (via arrow left)', async () => {
        await pressKey(page, 'ArrowLeft');
      });

      it('renders selection ring around media (via 2 arrow left)', async () => {
        await pressKey(page, ['ArrowLeft', 'ArrowLeft']);
      });

      it('should render left side gap cursor (via 3 arrow left)', async () => {
        await pressKey(page, ['ArrowLeft', 'ArrowLeft', 'ArrowLeft']);
      });
    });
  });
});
