import { MINIMUM_THRESHOLD } from '@atlaskit/visual-regression/helper';
import { initFullPageEditorWithAdf, snapshot, Device } from '../_utils';
import {
  clickToolbarMenu,
  ToolbarMenuItem,
} from '../../__helpers/page-objects/_toolbar';
import { selectors } from '../../__helpers/page-objects/_editor';
import { tableSelectors } from '../../__helpers/page-objects/_table';
import { insertTable } from '../../__helpers/page-objects/_table';
import {
  waitForEmojis,
  emojiReadySelector,
} from '../../__helpers/page-objects/_emoji';
import { waitForLoadedBackgroundImages } from '@atlaskit/visual-regression/helper';
import adf from './__fixtures__/noData-adf.json';

// TODO - add ADF before loading stuff
describe('z-indexes:', () => {
  let page: any;

  beforeAll(async () => {
    // @ts-ignore
    page = global.page;
  });

  beforeEach(async () => {
    await initFullPageEditorWithAdf(page, adf, Device.LaptopMDPI);
    await insertTable(page);
  });

  afterEach(async () => {
    await snapshot(page, MINIMUM_THRESHOLD);
  });

  it('should always position table trash icon below dropdowns from main menu', async () => {
    await page.waitForSelector(tableSelectors.removeTable);
    await clickToolbarMenu(page, ToolbarMenuItem.insertBlock);
    await page.waitForSelector(selectors.dropList);
  });

  it('should always position table trash icon below emoji picker', async () => {
    await page.waitForSelector(tableSelectors.removeTable);
    await clickToolbarMenu(page, ToolbarMenuItem.emoji);
    await page.waitForSelector(selectors.emojiPicker);
    await waitForEmojis(page);
    await waitForLoadedBackgroundImages(page, emojiReadySelector, 10000);
  });

  it('should always position table trash icon below mention picker', async () => {
    await page.waitForSelector(tableSelectors.removeTable);
    await clickToolbarMenu(page, ToolbarMenuItem.mention);
    await page.waitForSelector(selectors.mentionQuery);
  });
});
