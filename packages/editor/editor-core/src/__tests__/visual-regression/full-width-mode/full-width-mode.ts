import { initFullPageEditorWithAdf, Device, snapshot } from '../_utils';
import adf from './__fixtures__/mixed-content.adf.json';
import adfWithMedia from './__fixtures__/content-with-media.adf.json';
import adfWithBreakout from './__fixtures__/mixed-content-with-breakout.adf.json';
import { Page } from '../../__helpers/page-objects/_types';
import { scrollToTop } from '../../__helpers/page-objects/_editor';
import { waitForLoadedImageElements } from '@atlaskit/visual-regression/helper';

// In full-width mode we cap the max-width at 1800px, for sizes greater than this the
// content will be left-aligned. so we want to test a size < 1800 and a size > 1800
const widths = [2000, 1200];
widths.forEach(width => {
  describe(`Full-width mode (${width}px):`, () => {
    let page: Page;
    beforeEach(async () => {
      // @ts-ignore
      page = global.page;
      await initFullPageEditorWithAdf(
        page,
        adf,
        Device.LaptopHiDPI,
        { width, height: 800 },
        { appearance: 'full-width' },
      );
    });

    it('should display content in full-width mode', async () => {
      await scrollToTop(page);
      await snapshot(page);
    });
  });

  describe(`Full-width mode (${width}px): with media`, () => {
    let page: Page;
    it('should display content in full-width mode', async () => {
      // @ts-ignore
      page = global.page;
      await initFullPageEditorWithAdf(
        page,
        adfWithMedia,
        Device.LaptopHiDPI,
        { width, height: 800 },
        { appearance: 'full-width' },
      );
      await waitForLoadedImageElements(page);
      await snapshot(page);
    });
  });
});

describe('Full-width mode breakout', () => {
  it('should disable breakout and ignore sizes', async () => {
    // @ts-ignore
    let page = global.page;
    await initFullPageEditorWithAdf(
      page,
      adfWithBreakout,
      Device.LaptopHiDPI,
      { width: 2000, height: 800 },
      { appearance: 'full-width' },
    );
    await snapshot(page);
  });
});
