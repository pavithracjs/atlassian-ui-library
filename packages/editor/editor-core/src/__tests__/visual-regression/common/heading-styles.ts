import { initFullPageEditorWithAdf, snapshot, Device } from '../_utils';
import {
  clickToolbarMenu,
  ToolbarMenuItem,
} from '../../__helpers/page-objects/_toolbar';
import { selectors } from '../../__helpers/page-objects/_editor';
import adf from './__fixtures__/headings.json';

describe('heading styles:', () => {
  it('should matches the snapshot', async () => {
    // @ts-ignore
    const page = global.page;
    await initFullPageEditorWithAdf(page, adf, Device.LaptopMDPI);
    await clickToolbarMenu(page, ToolbarMenuItem.fontStyle);
    await page.waitForSelector(selectors.fontStyleDropList);
    await snapshot(page);
  });
});
