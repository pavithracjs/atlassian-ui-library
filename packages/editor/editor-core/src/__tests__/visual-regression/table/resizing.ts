import { waitForTooltip } from '@atlaskit/visual-regression/helper';
import {
  snapshot,
  initFullPageEditorWithAdf,
  initEditorWithAdf,
  Appearance,
} from '../_utils';
import adf from '../common/__fixtures__/noData-adf.json';
import {
  deleteColumn,
  resizeColumn,
  insertTable,
  grabResizeHandle,
  clickFirstCell,
  toggleBreakout,
  scrollTable,
  unselectTable,
} from '../../__helpers/page-objects/_table';
import { animationFrame } from '../../__helpers/page-objects/_editor';
import { Page } from '../../__helpers/page-objects/_types';
import mergedColsAdf from './__fixtures__/table-with-merged-columns-in-first-row.adf.json';
import mergedAllColsAdf from './__fixtures__/table-with-all-merged-columns-in-first-row.adf.json';
import mergedRandomColsAdf from './__fixtures__/table-with-randomly-merged-columns.adf.json';

describe('Snapshot Test: table resizing', () => {
  describe('Re-sizing', () => {
    let page: Page;

    beforeAll(() => {
      // @ts-ignore
      page = global.page;
    });

    beforeEach(async () => {
      await initFullPageEditorWithAdf(page, adf);
      await insertTable(page);
    });

    it(`resize a column with content width`, async () => {
      await resizeColumn(page, { colIdx: 2, amount: 123, row: 2 });
      await animationFrame(page);
      await animationFrame(page);
      await snapshot(page);
      await resizeColumn(page, { colIdx: 2, amount: -100, row: 2 });
      await animationFrame(page);
      await animationFrame(page);
      await snapshot(page);
    });

    it(`snaps back to layout width after column removal`, async () => {
      await deleteColumn(page, 1);
      // after deleting the middle column the cursor will land exactly on an insert col btn
      await waitForTooltip(page);
      await snapshot(page);
    });

    describe('Overflow Table', () => {
      beforeEach(async () => {
        // Go to overflow
        await resizeColumn(page, { colIdx: 2, amount: 500, row: 2 });
      });
      test('should overflow table when resizing over the available size', async () => {
        await snapshot(page);
      });

      test('should keep overflow when resizing an table with overflow', async () => {
        // Scroll to the end of col we are about to resize
        // Its in overflow.
        await scrollTable(page, 1);
        await resizeColumn(page, { colIdx: 2, amount: -550, row: 2 });
        // Scroll back so we can see the result of our resize.
        await scrollTable(page, 0);

        await snapshot(page);
      });

      describe('unselected', () => {
        beforeEach(async () => {
          await unselectTable(page);
        });

        test('should show overflow in both side when scroll is in the middle', async () => {
          await scrollTable(page, 0.5); // Scroll to the middle of the table
          await snapshot(page);
        });

        test('should show only left overflow when scroll is in the right', async () => {
          await scrollTable(page, 1); // Scroll to the right of the table
          await snapshot(page);
        });

        test('should show only right overflow when scroll is in the left', async () => {
          await scrollTable(page, 0); // Scroll to the left of the table
          await snapshot(page);
        });
      });
    });
  });
});

describe('Snapshot Test: table resize handle', () => {
  let page: Page;
  beforeEach(async () => {
    // @ts-ignore
    page = global.page;
    await initFullPageEditorWithAdf(page, adf);
    await insertTable(page);
  });

  describe('when table has merged cells', () => {
    it(`should render resize handle spanning all rows`, async () => {
      await grabResizeHandle(page, { colIdx: 2, row: 2 });
      await snapshot(page);
    });
  });
});

describe('Snapshot Test: table scale', () => {
  let page: Page;
  beforeEach(async () => {
    // @ts-ignore
    page = global.page;
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      adf,
      viewport: { width: 1280, height: 500 },
      editorProps: {
        allowDynamicTextSizing: true,
      },
    });
    await insertTable(page);
    await clickFirstCell(page);
  });

  it(`should not overflow the table with dynamic text sizing enabled`, async () => {
    await toggleBreakout(page, 1);
    await snapshot(page);
  });
});

describe('Snapshot Test: table with merged columns in the first row', () => {
  let page: Page;
  beforeEach(async () => {
    // @ts-ignore
    page = global.page;
  });

  it('should render resize handle', async () => {
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      adf: mergedColsAdf,
      viewport: { width: 1280, height: 500 },
      editorProps: {
        allowDynamicTextSizing: true,
      },
    });
    await clickFirstCell(page);
    await grabResizeHandle(page, { colIdx: 1, row: 2 });
    await snapshot(page);
  });

  describe('when table all columns merged in the first row', () => {
    it('should render resize handle', async () => {
      await initEditorWithAdf(page, {
        appearance: Appearance.fullPage,
        adf: mergedAllColsAdf,
        viewport: { width: 1280, height: 500 },
        editorProps: {
          allowDynamicTextSizing: true,
        },
      });
      await clickFirstCell(page);
      await grabResizeHandle(page, { colIdx: 1, row: 2 });
      await snapshot(page);
    });
  });

  describe('when table columns are randomly merged in the first row', () => {
    it('should resize columns', async () => {
      await initEditorWithAdf(page, {
        appearance: Appearance.fullPage,
        adf: mergedRandomColsAdf,
        viewport: { width: 1280, height: 500 },
        editorProps: {
          allowDynamicTextSizing: true,
        },
      });
      await clickFirstCell(page);
      await resizeColumn(page, { colIdx: 3, amount: 100, row: 2 });
      await snapshot(page);
    });
  });
});
