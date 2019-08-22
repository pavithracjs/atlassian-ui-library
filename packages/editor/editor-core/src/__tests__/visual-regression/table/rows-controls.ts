import { getBoundingRect } from '../../__helpers/page-objects/_editor';
import {
  clickFirstCell,
  tableSelectors,
} from '../../__helpers/page-objects/_table';
import { Page } from '../../__helpers/page-objects/_types';
import { initFullPageEditorWithAdf, snapshot } from '../_utils';
import adf from './__fixtures__/table-with-merged-cells-on-first-column.adf.json';

describe('Snapshot Test: hover rows controlls', () => {
  let page: Page;

  beforeAll(async () => {
    // @ts-ignore
    page = global.page;
  });

  describe('when there are merged cells at first column', () => {
    it.each([2, 3, 4])(
      'should display insert button on top for row %i ',
      async a => {
        await initFullPageEditorWithAdf(page, adf);

        await clickFirstCell(page);
        const bounds = await getBoundingRect(
          page,
          tableSelectors.nthRowControl(a),
        );

        const x = bounds.left;
        const y = bounds.top + 5;

        await page.mouse.move(x, y);
        await snapshot(page);
      },
    );

    it.each([2, 3, 4])(
      'should display insert button on bottom for row %i ',
      async a => {
        await initFullPageEditorWithAdf(page, adf);

        await clickFirstCell(page);
        const bounds = await getBoundingRect(
          page,
          tableSelectors.nthRowControl(a),
        );

        const x = bounds.left;
        const y = bounds.top + bounds.height - 5;

        await page.mouse.move(x, y);
        await snapshot(page);
      },
    );
  });
});
