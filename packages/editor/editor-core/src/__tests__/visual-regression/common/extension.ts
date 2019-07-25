import { MINIMUM_THRESHOLD } from '@atlaskit/visual-regression/helper';
import { initFullPageEditorWithAdf, Device, snapshot } from '../_utils';
import { Page } from '../../__helpers/page-objects/_types';
import {
  clickBlockMenuItem,
  BlockMenuItem,
} from '../../__helpers/page-objects/_blocks';

import { clickOnExtension } from '../../__helpers/page-objects/_extensions';

import adf from './__fixtures__/extension-wide.adf.json';

const blankDoc = {
  version: 1,
  type: 'doc',
  content: [],
};

describe('Extension:', () => {
  let page: Page;
  beforeEach(async () => {
    // @ts-ignore
    page = global.page;
  });

  it('should insert a block extension with a selected state.', async () => {
    await initFullPageEditorWithAdf(page, blankDoc, Device.LaptopMDPI);
    await clickBlockMenuItem(page, BlockMenuItem.blockExtension);
    await snapshot(page, MINIMUM_THRESHOLD);
  });

  it('should insert a bodied extension without a selected state.', async () => {
    await initFullPageEditorWithAdf(page, blankDoc, Device.LaptopMDPI);
    await clickBlockMenuItem(page, BlockMenuItem.bodiedExtension);
    await snapshot(page, MINIMUM_THRESHOLD);
  });

  it('should display a selected ring around a breakout extension', async () => {
    await initFullPageEditorWithAdf(page, adf, Device.LaptopMDPI);
    await clickOnExtension(
      page,
      'com.atlassian.confluence.macro.core',
      'block-eh',
    );
    await snapshot(page, MINIMUM_THRESHOLD);
  });
});
