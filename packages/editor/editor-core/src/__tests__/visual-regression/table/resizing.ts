import { snapshot, initFullPageEditorWithAdf, Device } from '../_utils';
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
import { TableCssClassName } from '../../../plugins/table/types';
import { pressKey } from '../../__helpers/page-objects/_keyboard';

describe('Snapshot Test: table resizing - resize handle zone', () => {
  let page: any;
  beforeEach(async () => {
    // @ts-ignore
    page = global.page;

    await initFullPageEditorWithAdf(page, adf, Device.LaptopHiDPI);
    await insertTable(page);

    // Set a background color to resize handler zone
    const css = `
      .${TableCssClassName.CELL_NODEVIEW_WRAPPER}:after,
      .${TableCssClassName.CELL_NODEVIEW_WRAPPER}:before {
        background-color: red;
      }
    `;
    await page.addStyleTag({ content: css });
  });

  afterEach(async () => {
    await page.reload(); // Clean css
  });

  it('should cover all cell height', async () => {
    await clickFirstCell(page);
    await pressKey(page, ['Enter', 'Enter', 'Enter', 'Enter']);

    await snapshot(page);
  });
});

describe('Snapshot Test: table resizing', () => {
  describe('Re-sizing', () => {
    let page: any;
    beforeEach(async () => {
      // @ts-ignore
      page = global.page;
      await initFullPageEditorWithAdf(page, adf, Device.LaptopHiDPI);
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
      await animationFrame(page);
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
  let page: any;
  beforeEach(async () => {
    // @ts-ignore
    page = global.page;
    await initFullPageEditorWithAdf(page, adf, Device.LaptopMDPI);
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
  let page: any;
  beforeEach(async () => {
    // @ts-ignore
    page = global.page;
    await initFullPageEditorWithAdf(page, adf, Device.LaptopHiDPI, undefined, {
      allowDynamicTextSizing: true,
    });
    await insertTable(page);
    await clickFirstCell(page);
  });

  it(`should not overflow the table with dynamic text sizing enabled`, async () => {
    await toggleBreakout(page, 1);
    await snapshot(page);
  });
});
