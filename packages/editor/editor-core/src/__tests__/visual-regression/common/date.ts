import { snapshot, initEditorWithAdf, Appearance } from '../_utils';
import adf from './__fixtures__/date-adf.json';
import { Page } from '../../__helpers/page-objects/_types';

describe('Date:', () => {
  let page: Page;
  beforeEach(async () => {
    // @ts-ignore
    page = global.page;
    await initEditorWithAdf(page, {
      adf,
      appearance: Appearance.fullPage,
      viewport: { width: 1280, height: 600 },
    });
  });

  it('should render and stay within bounds', async () => {
    await snapshot(page);
  });
});
