import { snapshot, initEditorWithAdf, Appearance } from '../_utils';
import adf from './__fixtures__/with-content.json';
import { Page } from '../../__helpers/page-objects/_types';

describe('Snapshot Test: Mobile Dark Editor', () => {
  let page: Page;
  beforeAll(async () => {
    // @ts-ignore
    page = global.page;
    await initEditorWithAdf(page, {
      adf,
      appearance: Appearance.mobile,
      viewport: { width: 414, height: 3000 }, // Width iPhone
      mode: 'dark',
    });
  });

  it('should correctly render dark mode in mobile editor', async () => {
    await snapshot(page, 0.2);
  });
});
