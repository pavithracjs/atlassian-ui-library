import { Page } from 'puppeteer';
import { snapshot, initRendererWithADF, Device } from './_utils';
import * as cardXSSADF from '../__fixtures__/card-xss.adf.json';

const initRenderer = async (page: Page, adf: any) => {
  await initRendererWithADF(page, {
    appearance: 'full-page',
    device: Device.LaptopMDPI,
    adf,
  });
};

describe('Snapshot Test: Cards', () => {
  let page: Page;
  beforeAll(() => {
    // @ts-ignore
    page = global.page;
  });

  afterEach(async () => {
    await snapshot(page);
  });

  it('should render unknown content for cards with invalid urls', async () => {
    await initRenderer(page, cardXSSADF);
  });
});
