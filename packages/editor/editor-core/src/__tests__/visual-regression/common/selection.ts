import { snapshot, initFullPageEditorWithAdf, Device } from '../_utils';
import * as adf from './__fixtures__/nested-elements.adf.json';
import {
  tableSelectors,
  clickFirstCell,
} from '../../__helpers/page-objects/_table';
import { animationFrame } from '../../__helpers/page-objects/_editor';

describe('Danger for nested elements', () => {
  let page;

  describe(`Full page`, () => {
    const threshold = 0.01;
    beforeAll(async () => {
      // @ts-ignore
      page = global.page;
    });

    beforeEach(async () => {
      await initFullPageEditorWithAdf(page, adf, Device.LaptopHiDPI);
      await clickFirstCell(page);
      await animationFrame(page);
    });

    afterEach(async () => {
      await animationFrame(page);
      await snapshot(page, threshold);
    });

    it(`should show danger for table and all nested elements`, async () => {
      await page.waitForSelector(tableSelectors.removeTable);
      await page.hover(tableSelectors.removeTable);
      await page.waitForSelector(tableSelectors.removeDanger);
    });
  });
});
