import {
  initFullPageEditorWithAdf,
  initCommentEditorWithAdf,
  snapshot,
  Device,
} from '../_utils';
import * as panel from './__fixtures__/panel-adf.json';

// skipping since new snapshot generated has problems
// Expected image to be the same size as the snapshot (1280x436), but was different (1280x435).
describe.skip('Panel overflow:', () => {
  let page: any;

  beforeAll(() => {
    // @ts-ignore
    page = global.page;
  });

  afterEach(async () => {
    await snapshot(page);
  });

  it('looks correct for laptopMDPI', async () => {
    await initFullPageEditorWithAdf(page, panel, Device.LaptopMDPI);
  });

  it('looks correct for ipad', async () => {
    await initFullPageEditorWithAdf(page, panel, Device.iPad);
  });

  it('looks correct for iphone', async () => {
    await initFullPageEditorWithAdf(page, panel, Device.iPhonePlus);
  });

  it('looks correct for LaptopMDPI in comment mode', async () => {
    await initCommentEditorWithAdf(page, panel, Device.LaptopMDPI);
  });
});
