import { Page } from 'puppeteer';
import { snapshot, initRendererWithADF, Device } from './_utils';
import * as nestedIframe from '../__fixtures__/extension-iframe-nested.adf.json';
import * as breakoutExtensions from '../__fixtures__/extension-breakout.adf.json';

const initRenderer = async (page: Page, adf: any) => {
  await initRendererWithADF(page, {
    appearance: 'full-page',
    device: Device.LaptopMDPI,
    adf,
  });
};

describe('Snapshot Test: Extensions', () => {
  let page: Page;
  beforeAll(() => {
    // @ts-ignore
    page = global.page;
  });

  afterEach(async () => {
    await snapshot(page);
  });

  it('should correctly stay within their parent layout regardless of specified width', async () => {
    await initRenderer(page, nestedIframe);
  });

  it('should correctly render breakout extensions', async () => {
    await initRenderer(page, breakoutExtensions);
  });
});
