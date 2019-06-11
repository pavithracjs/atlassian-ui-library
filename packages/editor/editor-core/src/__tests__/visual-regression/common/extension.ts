import { MINIMUM_THRESHOLD } from '@atlaskit/visual-regression/helper';
import { initFullPageEditorWithAdf, Device, snapshot } from '../_utils';
import { Page } from '../../__helpers/page-objects/_types';
import {
  clickBlockMenuItem,
  BlockMenuItem,
} from '../../__helpers/page-objects/_blocks';

describe('Extension:', () => {
  let page: Page;
  beforeEach(async () => {
    // @ts-ignore
    page = global.page;
    const adf = {
      version: 1,
      type: 'doc',
      content: [],
    };
    await initFullPageEditorWithAdf(page, adf, Device.LaptopMDPI);
  });

  it('should insert a block extension with a selected state.', async () => {
    await clickBlockMenuItem(page, BlockMenuItem.blockExtension);
    await snapshot(page, MINIMUM_THRESHOLD);
  });

  it('should insert a bodied extension without a selected state.', async () => {
    await clickBlockMenuItem(page, BlockMenuItem.bodiedExtension);
    await snapshot(page, MINIMUM_THRESHOLD);
  });
});
