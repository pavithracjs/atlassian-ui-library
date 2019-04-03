import { snapshot, initFullPageEditorWithAdf, Device } from '../_utils';
import * as tableInsideColumnsAdf from './__fixtures__/nested-table-inside-columns.adf.json';
import * as tableInsideExtAdf from './__fixtures__/nested-table-inside-bodied-ext.adf.json';
import { clickFirstCell } from '../../__helpers/page-objects/_table';
import { animationFrame } from '../../__helpers/page-objects/_editor';

describe('Snapshot Test: nested table', () => {
  let page: any;
  const tolerance = 0.01;

  beforeAll(async () => {
    // @ts-ignore
    page = global.page;
  });

  it('looks correct when nested inside Columns', async () => {
    await initFullPageEditorWithAdf(
      page,
      tableInsideColumnsAdf,
      Device.LaptopMDPI,
    );
    await clickFirstCell(page);
    await animationFrame(page);
    await snapshot(page, tolerance);
  });

  it('looks correct when nested inside bodied extensions', async () => {
    await initFullPageEditorWithAdf(page, tableInsideExtAdf, Device.LaptopMDPI);
    await clickFirstCell(page);
    await animationFrame(page);
    await snapshot(page, tolerance);
  });
});
