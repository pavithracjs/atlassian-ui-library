import { MINIMUM_THRESHOLD } from '@atlaskit/visual-regression/helper';
import { initFullPageEditorWithAdf, snapshot, Device } from '../_utils';
import longContent from './__fixtures__/long-content-adf.json';
import { typeInEditorAtEndOfDocument } from '../../__helpers/page-objects/_editor';
import { tableSelectors } from '../../__helpers/page-objects/_table';
import { panelSelectors } from '../../__helpers/page-objects/_panel';
import { decisionSelectors } from '../../__helpers/page-objects/_decision';
import { pressKey } from '../../__helpers/page-objects/_keyboard';

describe('Gutter:', () => {
  let page: any;

  beforeEach(async () => {
    // @ts-ignore
    page = global.page;
    await initFullPageEditorWithAdf(page, longContent, Device.LaptopMDPI);
  });

  afterEach(async () => {
    await snapshot(page, MINIMUM_THRESHOLD);
  });

  it('should add gutter at the bottom of the page', async () => {
    await typeInEditorAtEndOfDocument(page, 'Hello World');
  });

  it('should add gutter if a table is added at the end of the editor', async () => {
    await typeInEditorAtEndOfDocument(page, '/table  ', { delay: 100 });

    await page.waitForSelector(tableSelectors.tableTh);

    await pressKey(page, ['ArrowDown', 'ArrowDown']); // Go to last row
  });

  it('should add gutter if a panel is added at the end of the editor', async () => {
    await typeInEditorAtEndOfDocument(page, '/info ', { delay: 100 });

    await page.waitForSelector(panelSelectors.infoPanel);
  });

  it('should add gutter if a decision is added at the end of the editor', async () => {
    await typeInEditorAtEndOfDocument(page, '/decision ', { delay: 100 });

    await page.waitForSelector(decisionSelectors.decision);
  });
});
