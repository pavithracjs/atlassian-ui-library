import { snapshot, initEditorWithAdf, Appearance } from '../_utils';
import {
  clickToolbarMenu,
  ToolbarMenuItem,
  toolbarMenuItemsSelectors as selectors,
} from '../../__helpers/page-objects/_toolbar';
import { Page } from '../../__helpers/page-objects/_types';

describe('Toolbar', () => {
  let page: Page;

  beforeEach(async () => {
    // @ts-ignore
    page = global.page;
    await initEditorWithAdf(page, {
      appearance: Appearance.fullPage,
      viewport: { width: 1000, height: 350 },
    });
  });

  afterEach(async () => {
    await page.waitForSelector(selectors[ToolbarMenuItem.toolbarDropList]);
    await snapshot(page);
  });

  it('should display headings menu correctly', async () => {
    await clickToolbarMenu(page, ToolbarMenuItem.fontStyle);
  });

  it('should display text formatting menu correctly', async () => {
    await clickToolbarMenu(page, ToolbarMenuItem.moreFormatting);
  });

  it('should display insert menu correctly', async () => {
    await page.setViewport({ width: 1000, height: 700 });
    await clickToolbarMenu(page, ToolbarMenuItem.insertMenu);
  });
});
