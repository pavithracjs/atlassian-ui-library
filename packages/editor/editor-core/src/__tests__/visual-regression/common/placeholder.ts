import { MINIMUM_THRESHOLD } from '@atlaskit/visual-regression/helper';
import { initFullPageEditorWithAdf, snapshot } from '../_utils';
import adf from './__fixtures__/noData-adf.json';

describe('Placeholder', () => {
  let page: any;

  beforeAll(() => {
    // @ts-ignore
    page = global.page;
  });

  it('wraps long placeholder onto new line', async () => {
    await initFullPageEditorWithAdf(page, adf);
    await snapshot(page, MINIMUM_THRESHOLD);
  });
});
