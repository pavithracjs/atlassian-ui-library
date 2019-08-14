import { snapshot, initEditorWithAdf, Appearance } from '../_utils';
import adf from './__fixtures__/noData-adf.json';

describe('Placeholder', () => {
  let page: any;

  beforeAll(() => {
    // @ts-ignore
    page = global.page;
  });

  it('wraps long placeholder onto new line', async () => {
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      adf,
      viewport: { width: 800, height: 300 },
    });
    await snapshot(page);
  });
});
