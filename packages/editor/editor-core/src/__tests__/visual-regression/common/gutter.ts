import { initFullPageEditorWithAdf, snapshot, Device } from '../_utils';
import longContentAdf from './__fixtures__/long-content-adf.json';
import { parseAndInlineAdfMedia } from '@atlaskit/editor-test-helpers';
import { waitForLoadedImageElements } from '@atlaskit/visual-regression/helper';
import { typeInEditorAtEndOfDocument } from '../../__helpers/page-objects/_editor';
import { tableSelectors } from '../../__helpers/page-objects/_table';
import { panelSelectors } from '../../__helpers/page-objects/_panel';
import { decisionSelectors } from '../../__helpers/page-objects/_decision';
import { pressKey } from '../../__helpers/page-objects/_keyboard';

describe('Gutter:', () => {
  let page: any;

  const adf = parseAndInlineAdfMedia(longContentAdf);

  beforeEach(async () => {
    // @ts-ignore
    page = global.page;
    await initFullPageEditorWithAdf(page, adf, Device.LaptopMDPI);
    await waitForLoadedImageElements(page, 1000); // 1 second timeout for inlined media.
  });

  it('should add gutter at the bottom of the page', async () => {
    await typeInEditorAtEndOfDocument(page, 'Hello World');
    await snapshot(page);
  });

  it('should add gutter if a table is added at the end of the editor', async () => {
    await typeInEditorAtEndOfDocument(page, '/table  ', { delay: 100 });

    await page.waitForSelector(tableSelectors.tableTh);

    await pressKey(page, ['ArrowDown', 'ArrowDown']); // Go to last row
    await snapshot(page);
  });

  it('should add gutter if a panel is added at the end of the editor', async () => {
    await typeInEditorAtEndOfDocument(page, '/info ', { delay: 100 });

    await page.waitForSelector(panelSelectors.infoPanel);
    await snapshot(page);
  });

  it('should add gutter if a decision is added at the end of the editor', async () => {
    await typeInEditorAtEndOfDocument(page, '/decision ', { delay: 100 });

    await page.waitForSelector(decisionSelectors.decision);
    await snapshot(page);
  });
});
