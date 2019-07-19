import { snapshot, initFullPageEditorWithAdf, Device } from '../_utils';
import adf from './__fixtures__/table-inside-bodied-extension.adf.json';
import {
  insertRow,
  insertColumn,
  clickFirstCell,
} from '../../__helpers/page-objects/_table';

describe('Snapshot Test: table insert/delete', () => {
  let page: any;
  beforeAll(async () => {
    // @ts-ignore
    page = global.page;
  });

  beforeEach(async () => {
    await initFullPageEditorWithAdf(page, adf, Device.LaptopHiDPI);
    await clickFirstCell(page);
  });

  afterEach(async () => {
    await snapshot(page);
  });

  it('should be able to insert row', async () => {
    await insertRow(page, 1);
  });

  it('should be able to insert column', async () => {
    await insertColumn(page, 2);
  });
});
