import { Device, initFullPageEditorWithAdf, snapshot } from '../_utils';
import { animationFrame } from '../../__helpers/page-objects/_editor';
import {
  clickCellOptions,
  getSelectorForTableCell,
  selectCellOption,
  tableSelectors,
  selectColumn,
  clickFirstCell,
  grabResizeHandle,
  hoverColumnControls,
} from '../../__helpers/page-objects/_table';
import {
  pressKeyDown,
  pressKeyUp,
} from '../../__helpers/page-objects/_keyboard';
import adf from './__fixtures__/default-table.adf.json';
import adfTableWithoutTableHeader from './__fixtures__/table-without-table-header.adf.json';

describe('Table context menu: merge-split cells', () => {
  let page: any;

  const tableMergeCells = async (fromCell: string, toCell: string) => {
    await page.click(fromCell);
    await pressKeyDown(page, 'Shift');
    await page.click(toCell);
    await pressKeyUp(page, 'Shift');
    await page.waitForSelector(tableSelectors.selectedCell);
    await clickCellOptions(page);
    await animationFrame(page);
    await selectCellOption(page, tableSelectors.mergeCellsText);
    await snapshot(page);
  };

  beforeAll(async () => {
    // @ts-ignore
    page = global.page;
  });

  beforeEach(async () => {
    await initFullPageEditorWithAdf(page, adf, Device.LaptopHiDPI);
    await clickFirstCell(page);
  });

  it(`should render column controls for each column regardless of merged cells in the first row`, async () => {
    const from = getSelectorForTableCell({
      row: 1,
      cell: 1,
      cellType: 'th',
    });
    const to = getSelectorForTableCell({ row: 1, cell: 3, cellType: 'th' });
    await tableMergeCells(from, to);
  });

  it('should display the borders when the column controls are selected', async () => {
    await selectColumn(1);

    await snapshot(
      page,
      { tolerance: 0, useUnsafeThreshold: true },
      tableSelectors.nthColumnControl(1),
    );
  });

  it('should display column resizer handler on top of the column controls', async () => {
    await grabResizeHandle(page, { colIdx: 1, row: 2 });
    await snapshot(
      page,
      { tolerance: 0, useUnsafeThreshold: true },
      tableSelectors.nthColumnControl(1),
    );
  });

  describe('when there is no table header', () => {
    it('should display hover effect', async () => {
      await initFullPageEditorWithAdf(
        page,
        adfTableWithoutTableHeader,
        Device.LaptopHiDPI,
      );
      await clickFirstCell(page);
      await hoverColumnControls(page, 1, 'right');
      await snapshot(page);
    });

    it('should display selected effect', async () => {
      await initFullPageEditorWithAdf(
        page,
        adfTableWithoutTableHeader,
        Device.LaptopHiDPI,
      );
      await clickFirstCell(page);
      await selectColumn(1);
      await snapshot(page);
    });
  });
});
