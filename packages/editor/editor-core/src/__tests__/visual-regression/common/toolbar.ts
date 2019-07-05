import { initFullPageEditorWithAdf, snapshot, Device } from '../_utils';
import {
  clickToolbarMenu,
  ToolbarMenuItem,
  toolbarMenuItemsSelectors as selectors,
} from '../../__helpers/page-objects/_toolbar';
import { Page } from '../../__helpers/page-objects/_types';

describe('Toolbar', () => {
  let page: Page;

  beforeAll(() => {
    // @ts-ignore
    page = global.page;
  });

  afterEach(async () => {
    await page.waitForSelector(selectors[ToolbarMenuItem.toolbarDropList]);
    await snapshot(page);
  });

  it('should display headings menu correctly', async () => {
    await initFullPageEditorWithAdf(page, {}, Device.LaptopMDPI);
    await clickToolbarMenu(page, ToolbarMenuItem.fontStyle);
  });

  it('should display text formatting menu correctly', async () => {
    await initFullPageEditorWithAdf(page, {}, Device.LaptopMDPI);
    await clickToolbarMenu(page, ToolbarMenuItem.moreFormatting);
  });

  it('should display insert menu correctly', async () => {
    await initFullPageEditorWithAdf(page, {}, Device.LaptopMDPI);
    await clickToolbarMenu(page, ToolbarMenuItem.insertMenu);
  });
});
