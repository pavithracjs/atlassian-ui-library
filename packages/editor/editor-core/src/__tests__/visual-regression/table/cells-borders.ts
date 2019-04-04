import { snapshot, initFullPageEditorWithAdf } from '../_utils';
import * as adf from './__fixtures__/table-with-merged-rows.adf.json';

describe('Table cells borders:fullpage', () => {
  let page: any;
  const threshold = 0.01;

  beforeAll(async () => {
    // @ts-ignore
    page = global.page;
  });

  it('display cell borders', async () => {
    await initFullPageEditorWithAdf(page, adf);
    await snapshot(page, threshold);
  });
});
