import { initFullPageEditorWithAdf, snapshot, Device } from '../_utils';
import * as col2 from './__fixtures__/column2-adf.json';
import * as col3 from './__fixtures__/column3-adf.json';
import * as colLeftSidebar from './__fixtures__/columnLeftSidebar-adf.json';
import * as columnRightSidebar from './__fixtures__/columnRightSidebar-adf.json';

describe('Layouts:', () => {
  let page: any;

  const layouts = [
    { name: '2 columns', adf: col2 },
    { name: '3 columns', adf: col3 },
    { name: 'left sidebar', adf: colLeftSidebar },
    { name: 'right sidebar', adf: columnRightSidebar },
  ];

  beforeAll(async () => {
    // @ts-ignore
    page = global.page;
  });

  afterEach(async () => {
    await snapshot(page, 0.02);
  });

  layouts.forEach(layout => {
    describe(layout.name, () => {
      const initEditor = async (device: Device) =>
        initFullPageEditorWithAdf(page, layout.adf, device, undefined, {
          allowLayouts: { allowBreakout: true, UNSAFE_addSidebarLayouts: true },
        });

      it('should correctly render layout on MDPI', async () => {
        await initEditor(Device.LaptopMDPI);
      });

      it('should stack layout on smaller ipad', async () => {
        await initEditor(Device.iPad);
      });

      it('should stack layout on smaller iPhone', async () => {
        await initEditor(Device.iPhonePlus);
      });
    });
  });
});
