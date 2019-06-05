import { MINIMUM_THRESHOLD } from '@atlaskit/visual-regression/helper';
import { Device, initFullPageEditorWithAdf, snapshot } from '../_utils';
import { animationFrame } from '../../__helpers/page-objects/_editor';
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

  const tableMergeCells = async (fromCell: string, toCell: string) => {
    await page.click(fromCell);
    await pressKeyDown(page, 'Shift');
    await page.click(toCell);
    await pressKeyUp(page, 'Shift');
    await page.waitForSelector(tableSelectors.selectedCell);
    await clickCellOptions(page);
    await animationFrame(page);
    await selectCellOption(page, tableSelectors.mergeCellsText);
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

  it(`should render column controls for each column regardless of merged cells in the first row`, async () => {
    const from = getSelectorForTableCell({
      row: 1,
      cell: 1,
      cellType: 'th',
    });
    const to = getSelectorForTableCell({ row: 1, cell: 3, cellType: 'th' });
    await tableMergeCells(from, to);
  });
});
