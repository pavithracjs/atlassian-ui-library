import { MINIMUM_THRESHOLD } from '@atlaskit/visual-regression/helper';
import { initFullPageEditorWithAdf, Device, snapshot } from '../_utils';
import adf from './__fixtures__/date-adf.json';
import { Page } from '../../__helpers/page-objects/_types';

describe('Date:', () => {
  let page: Page;
  beforeEach(async () => {
    // @ts-ignore
    page = global.page;
    await initFullPageEditorWithAdf(page, adf, Device.LaptopMDPI);
  });

  it('should render and stay within bounds', async () => {
    await snapshot(page, MINIMUM_THRESHOLD);
  });
});
