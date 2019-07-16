import { getBoundingRect } from '../../__helpers/page-objects/_editor';
import {
  clickFirstCell,
  tableSelectors,
  getSelectorForTableCell,
} from '../../__helpers/page-objects/_table';
import {
  Device,
  initCommentEditorWithAdf,
  initFullPageEditorWithAdf,
  snapshot,
} from '../_utils';
import adf from './__fixtures__/numbered-table.adf.json';

describe('Snapshot Test: numbered table', () => {
  let page: any;

  beforeAll(async () => {
    // @ts-ignore
    page = global.page;
  });
  test('should show insert button when mouse is hover numbered button', async () => {
    await initFullPageEditorWithAdf(page, adf);

    await clickFirstCell(page);
    const bounds = await getBoundingRect(
      page,
      tableSelectors.nthNumberedColumnRowControl(2),
    );

    const x = bounds.left;
    const y = bounds.top + bounds.height - 5;

    await page.mouse.move(x, y);
    await snapshot(page);
  });
});

describe('Snapshot Test: numbered table', () => {
  let page: any;
  const clickFirstCell = async () => {
    await page.click(getSelectorForTableCell({ row: 1, cell: 1 }));
    await page.waitForSelector(tableSelectors.removeTable);
  };
  beforeAll(async () => {
    // @ts-ignore
    page = global.page;
  });

  afterEach(async () => {
    await clickFirstCell();
    await snapshot(page);
  });

  it(`looks correct at LaptopMDPI for fullpage`, async () => {
    await initFullPageEditorWithAdf(page, adf, Device.LaptopMDPI);
  });

  it(`looks correct at iPadPro for fullpage`, async () => {
    await initFullPageEditorWithAdf(page, adf, Device.iPadPro);
  });

  it(`looks correct at LaptopMDPI for comment`, async () => {
    await initCommentEditorWithAdf(page, adf, Device.LaptopMDPI);
  });
});
