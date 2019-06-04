import { MINIMUM_THRESHOLD } from '@atlaskit/visual-regression/helper';
import { initFullPageEditorWithAdf, snapshot, Device } from '../_utils';
import { Page } from '../../__helpers/page-objects/_types';
import * as col2 from './__fixtures__/column2-adf.json';
import * as col3 from './__fixtures__/column3-adf.json';
import * as colLeftSidebar from './__fixtures__/columnLeftSidebar-adf.json';
import * as colRightSidebar from './__fixtures__/columnRightSidebar-adf.json';
import * as col3WithSidebars from './__fixtures__/column3WithSidebars-adf.json';

const layoutColSelector = '[data-layout-column]';

describe('Layouts:', () => {
  let page: Page;

  const layouts = [
    { name: '2 columns', adf: col2 },
    { name: '3 columns', adf: col3 },
    { name: 'left sidebar', adf: colLeftSidebar },
    { name: 'right sidebar', adf: colRightSidebar },
    { name: '3 columns with sidebars', adf: col3WithSidebars },
  ];

  beforeAll(async () => {
    // @ts-ignore
    page = global.page;
  });

  afterEach(async () => {
    await page.click(layoutColSelector); // click inside column to get toolbar
    await snapshot(page, MINIMUM_THRESHOLD);
  });

  layouts.forEach(layout => {
    describe(layout.name, () => {
      const initEditor = async (device: Device) =>
        initFullPageEditorWithAdf(page, layout.adf, device, undefined, {
          allowLayouts: { allowBreakout: true, UNSAFE_addSidebarLayouts: true },
        });

      it('should correctly render layout on laptop', async () => {
        await initEditor(Device.LaptopMDPI);
      });

      it('should stack layout on smaller screen', async () => {
        await initEditor(Device.iPad);
      });
    });
  });
});
