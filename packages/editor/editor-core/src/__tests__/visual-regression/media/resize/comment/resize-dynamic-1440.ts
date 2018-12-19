import {
  initEditor,
  insertMedia,
  setupMediaMocksProviders,
  editable,
  setFeature,
  viewportSizes,
  rerenderEditor,
} from '../../../_utils';
import { resizeWithSnapshots } from '../../_utils';

describe('Snapshot Test: Media', () => {
  describe('comment editor', () => {
    const { width, height } = viewportSizes.find(size => size.width === 1440)!;
    describe(`at ${width}x${height} with dynamic text sizing`, async () => {
      let page;
      let editorWidth;

      beforeAll(async () => {
        // @ts-ignore
        page = global.page;
        await initEditor(page, 'comment');
        await page.setViewport({ width, height });

        await setFeature(page, 'dynamicTextSizing', true);
        await setFeature(page, 'imageResizing', true);

        await setupMediaMocksProviders(page);
      });

      beforeEach(async () => {
        // clear the editor after each test
        await rerenderEditor(page);
        editorWidth = await page.$eval(editable, el => el.clientWidth);
      });

      describe('center layout', () => {
        [2, 6, 10].forEach(cols => {
          it(`can make an image ${cols} columns wide`, async () => {
            await insertMedia(page);
            await page.click('.media-single');
            await page.waitForSelector('.mediaSingle-resize-handle-right');

            // images resize inwards towards the middle
            await resizeWithSnapshots(
              page,
              -((editorWidth / 2) * ((12 - cols) / 12)),
            );
          });
        });
      });

      describe('lists', () => {
        [2, 6, 10, 12].forEach(cols => {
          it(`can make an image in a list ${cols} columns wide`, async () => {
            await page.click(editable);
            await page.type(editable, '* ');

            await insertMedia(page);
            await page.click('.media-single');

            await page.waitForSelector('.mediaSingle-resize-handle-right');
            await resizeWithSnapshots(
              page,
              -((editorWidth / 12) * (12 - cols)),
            );
          });
        });
      });
    });
  });
});
