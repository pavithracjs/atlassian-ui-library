import { snapshot, initEditorWithAdf, Appearance } from '../_utils';
import {
  changeMediaLayout,
  insertMedia,
  waitForMediaToBeLoaded,
  clickMediaInPosition,
  mediaSingleLayouts,
} from '../../__helpers/page-objects/_media';
import { typeInEditor } from '../../__helpers/page-objects/_editor';
import { pressKey } from '../../__helpers/page-objects/_keyboard';

// add some comment
describe('Snapshot Test: Media', () => {
  let page: any;
  beforeEach(async () => {
    // @ts-ignore
    page = global.page;
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      editorProps: {
        media: {
          allowMediaSingle: true,
          allowMediaGroup: true,
          allowResizing: false,
        },
      },
      viewport: { width: 1280, height: 800 },
    });

    // type some text
    await typeInEditor(page, 'some text');
    await pressKey(page, [
      // Go left 3 times to insert image in the middle of the text
      'ArrowLeft',
      'ArrowLeft',
      'ArrowLeft',
      'ArrowLeft',
    ]);
  });

  describe('Layouts', () => {
    it('can switch layouts on media', async () => {
      // now we can insert media as necessary
      await insertMedia(page);
      await waitForMediaToBeLoaded(page);

      await clickMediaInPosition(page, 0);

      // change layouts
      for (let layout of mediaSingleLayouts) {
        // click it so the toolbar appears
        await changeMediaLayout(page, layout);
        await clickMediaInPosition(page, 0);

        await snapshot(page);
      }
    });

    it('can switch layouts on individual media', async () => {
      // We need a bigger height to capture multiple large images in a row.
      await page.setViewport({ width: 1280, height: 1024 * 2 });

      // now we can insert media as necessary
      await insertMedia(page, ['one.svg', 'two.svg']);
      await waitForMediaToBeLoaded(page);

      await clickMediaInPosition(page, 1);

      // change layouts
      for (let layout of mediaSingleLayouts) {
        // click the *second one* so the toolbar appears
        await changeMediaLayout(page, layout);
        await clickMediaInPosition(page, 1);

        await snapshot(page);
      }
    });
  });
});
