import { initFullPageEditorWithAdf, Device, snapshot } from '../_utils';
import * as adf from './__fixtures__/mixed-content.adf.json';
import { Page } from '../../__helpers/page-objects/_types';

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
        { fullWidthMode: true },
      );
    });

    it('should display content in full-width mode', async () => {
      await snapshot(page, 0.2);
    });
  });
});
