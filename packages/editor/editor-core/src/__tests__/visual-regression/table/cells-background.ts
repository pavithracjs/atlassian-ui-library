import { Device, initFullPageEditorWithAdf, snapshot } from '../_utils';

import {
  selectCellBackground,
  clickFirstCell,
} from '../../__helpers/page-objects/_table';

import adf from './__fixtures__/default-table.adf.json';
import { Page } from '../../__helpers/page-objects/_types';

describe('Table context menu: cells background', () => {
  let page: Page;

  beforeAll(async () => {
    // @ts-ignore
    page = global.page;
  });

  beforeEach(async () => {
    await initFullPageEditorWithAdf(page, adf, Device.LaptopMDPI);
    await clickFirstCell(page);
  });

  it(`should set background color to cells`, async () => {
    await selectCellBackground({
      page,
      colorIndex: 2,
      from: {
        row: 1,
        column: 1,
      },
      to: {
        row: 1,
        column: 3,
      },
    });
    await snapshot(page);

    await selectCellBackground({
      page,
      colorIndex: 3,
      from: {
        row: 2,
        column: 1,
      },
      to: {
        row: 2,
        column: 3,
      },
    });
    await snapshot(page);

    await selectCellBackground({
      page,
      colorIndex: 4,
      from: {
        row: 3,
        column: 1,
      },
      to: {
        row: 3,
        column: 3,
      },
    });
    await snapshot(page);
  });
});
