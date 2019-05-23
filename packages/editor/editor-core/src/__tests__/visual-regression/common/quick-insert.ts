import { MINIMUM_THRESHOLD } from '@atlaskit/visual-regression/helper';
import { initFullPageEditorWithAdf, Device, snapshot } from '../_utils';
import adf from './__fixtures__/blank-adf.json';
import { Page } from '../../__helpers/page-objects/_types';
import { typeInEditorAtEndOfDocument } from '../../__helpers/page-objects/_editor';
import { waitForMenuIconsToLoad } from '../../__helpers/page-objects/_quick-insert';

describe('Quick Insert:', () => {
  let page: Page;
  beforeEach(async () => {
    // @ts-ignore
    page = global.page;
    await initFullPageEditorWithAdf(page, adf, Device.LaptopHiDPI);
  });

  it('should render the quick insert menu', async () => {
    await typeInEditorAtEndOfDocument(page, '/');
    await page.waitForSelector('.fabric-editor-typeahead');
    await waitForMenuIconsToLoad(page);

    await snapshot(page, MINIMUM_THRESHOLD);
  });
});
