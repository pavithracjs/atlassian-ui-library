import { MINIMUM_THRESHOLD } from '@atlaskit/visual-regression/helper';
import { initFullPageEditorWithAdf, Device, snapshot } from '../_utils';
import adf from './__fixtures__/card-xss.adf.json';
import { Page } from '../../__helpers/page-objects/_types';

describe('Cards:', () => {
  let page: Page;
  beforeEach(async () => {
    // @ts-ignore
    page = global.page;
    await initFullPageEditorWithAdf(page, adf, Device.LaptopMDPI);
  });

  it('should render invalid urls as invalid content', async () => {
    await snapshot(page, MINIMUM_THRESHOLD);
  });
});
