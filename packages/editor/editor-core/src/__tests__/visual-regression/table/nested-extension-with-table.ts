import { snapshot, initFullPageEditorWithAdf, Device } from '../_utils';
import adf from './__fixtures__/nested-table.adf.json';
import { clickFirstCell } from '../../__helpers/page-objects/_table';
import { animationFrame } from '../../__helpers/page-objects/_editor';

describe('Snapshot Test: nested block extension with table', () => {
  let page: any;

  beforeAll(async () => {
    // @ts-ignore
    page = global.page;
  });

  it(`looks correct at LaptopMDPI for fullpage`, async () => {
    await initFullPageEditorWithAdf(page, adf, Device.LaptopMDPI);
    await clickFirstCell(page);
    await animationFrame(page);
    await snapshot(page, 0.01);
  });
});
