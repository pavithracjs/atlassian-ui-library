import { MINIMUM_THRESHOLD } from '@atlaskit/visual-regression/helper';
import {
  snapshot,
  initFullPageEditorWithAdf,
  Device,
  initCommentEditorWithAdf,
} from '../_utils';
import {
  getSelectorForTableCell,
  tableSelectors,
} from '../../__helpers/page-objects/_table';
import adf from './__fixtures__/numbered-table.adf.json';

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
    await snapshot(page, MINIMUM_THRESHOLD);
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
