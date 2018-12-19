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
import { mediaSingleLayouts } from '../../layouts';

describe('Snapshot Test: Media', () => {
  describe('full page editor', () => {
    const { width, height } = viewportSizes.find(size => size.width === 800)!;
    describe(`at ${width}x${height} with dynamic text sizing`, async () => {
      let page;
      let editorWidth;

      beforeAll(async () => {
        // @ts-ignore
        page = global.page;
        await initEditor(page, 'full-page-with-toolbar');
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

      describe('wrap-left layout', () => {
        [1, 2, 6].forEach(cols => {
          it(`can make an wrap-left image ${cols} columns wide`, async () => {
            await insertMedia(page);
            await page.click('.media-single');

            // change layout
            const layoutButton = `[aria-label="${
              mediaSingleLayouts['wrap-left']
            }"]`;
            await page.waitForSelector(layoutButton);
            await page.click(layoutButton);

            await page.waitForSelector(`.media-single.image-wrap-left`);

            // resize from right handle
            await page.waitForSelector('.mediaSingle-resize-handle-right');

            await resizeWithSnapshots(
              page,
              -((editorWidth / 12) * (12 - cols)),
            );
          });
        });
      });

      describe('wrap-right layout', () => {
        [10, 11].forEach(cols => {
          it(`can make an wrap-right image ${cols} columns wide`, async () => {
            await insertMedia(page);
            await page.click('.media-single');

            // change layout
            const layoutButton = `[aria-label="${
              mediaSingleLayouts['wrap-right']
            }"]`;
            await page.waitForSelector(layoutButton);
            await page.click(layoutButton);

            await page.waitForSelector(`.media-single.image-wrap-right`);

            // resize from left handle
            await page.waitForSelector('.mediaSingle-resize-handle-left');
            await resizeWithSnapshots(
              page,
              (editorWidth / 12) * (12 - cols),
              'left',
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
