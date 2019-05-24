import { MINIMUM_THRESHOLD } from '@atlaskit/visual-regression/helper';
import { Device, initFullPageEditorWithAdf, snapshot } from '../_utils';
import {
  clickCellOptions,
  getSelectorForTableCell,
  selectCellOption,
  tableSelectors,
  clickFirstCell,
} from '../../__helpers/page-objects/_table';
import {
  pressKeyDown,
  pressKeyUp,
} from '../../__helpers/page-objects/_keyboard';
import adf from './__fixtures__/default-table.adf.json';

describe('Table context menu: merge-split cells', () => {
  let page: any;

  const tableMergeAndSplitCells = async (
    firstCell: string,
    lastCell: string,
  ) => {
    await page.click(firstCell);
    await pressKeyDown(page, 'Shift');
    await page.click(lastCell);
    await pressKeyUp(page, 'Shift');
    await page.waitForSelector(tableSelectors.selectedCell);
    await clickCellOptions(page);
    await snapshot(page, MINIMUM_THRESHOLD);
    await selectCellOption(page, tableSelectors.mergeCellsText);
    await snapshot(page, MINIMUM_THRESHOLD);
    await page.waitForSelector(firstCell);
    await page.click(firstCell);
    await clickCellOptions(page);
    await snapshot(page, MINIMUM_THRESHOLD);
    await selectCellOption(page, tableSelectors.splitCellText);
    await snapshot(page, MINIMUM_THRESHOLD);
  };

  beforeAll(async () => {
    // @ts-ignore
    page = global.page;
  });

  beforeEach(async () => {
    await initFullPageEditorWithAdf(page, adf, Device.LaptopHiDPI);
    await clickFirstCell(page);
  });

  it(`should merge and split cell for row`, async () => {
    const firstCell = getSelectorForTableCell({
      row: 1,
      cell: 1,
      cellType: 'th',
    });
    let lastCell = getSelectorForTableCell({ row: 3, cell: 1 });
    await tableMergeAndSplitCells(firstCell, lastCell);
  });

  it(`should merge and split cell for column`, async () => {
    const firstCell = getSelectorForTableCell({ row: 2, cell: 1 });
    const lastCell = getSelectorForTableCell({ row: 2, cell: 3 });
    await tableMergeAndSplitCells(firstCell, lastCell);
  });

  it(`should merge and split cell for row+col`, async () => {
    const firstCell = getSelectorForTableCell({ row: 2, cell: 1 });
    const lastCell = getSelectorForTableCell({ row: 3, cell: 2 });
    await tableMergeAndSplitCells(firstCell, lastCell);
  });
});
