import { initFullPageEditorWithAdf, Device, snapshot } from '../_utils';
import adf from './__fixtures__/column3-adf.json';
import { Page } from '../../__helpers/page-objects/_types';
import { pressKey } from '../../__helpers/page-objects/_keyboard';
import {
  selectors,
  typeInEditorAtEndOfDocument,
} from '../../__helpers/page-objects/_editor';

// TODO:ED-6676
describe.skip('Columns:', () => {
  let page: Page;
  beforeEach(async () => {
    // @ts-ignore
    page = global.page;
    await initFullPageEditorWithAdf(page, adf, Device.LaptopHiDPI);
  });

  it('should render prosemirror selected node state', async () => {
    await typeInEditorAtEndOfDocument(page, '#');
    await pressKey(page, ['ArrowLeft', 'Backspace']);
    await page.waitForSelector(selectors.selectedNode);
    await snapshot(page);
  });
});
