import { Page } from 'puppeteer';
import { snapshot, Device, initRendererWithADF } from '../_utils';
import * as resizeAdf from './__fixtures__/renderer-media.adf.json';
import * as layoutAdf from '../../../../examples/helper/media-resize-layout.adf.json';
import { selectors as rendererSelectors } from '../../__helpers/page-objects/_renderer';

const devices = [Device.LaptopHiDPI, Device.iPad];

const initRenderer = async (page: Page, adf: any, device: Device) =>
  await initRendererWithADF(page, {
    appearance: 'full-page',
    rendererProps: { allowDynamicTextSizing: true },
    adf,
    device,
  });

describe('Snapshot Test: Media', () => {
  let page: Page;

  beforeEach(() => {
    // @ts-ignore
    page = global.page;
  });

  afterEach(async () => {
    await page.waitForSelector(rendererSelectors.document);
    await snapshot(page, {}, rendererSelectors.document);
  });

  describe('resize', () => {
    devices.forEach(device => {
      it(`should correctly render for ${device}`, async () => {
        await initRenderer(page, resizeAdf, device);
      });
    });
  });

  describe('layout', () => {
    devices.forEach(device => {
      it(`should correctly render for ${device}`, async () => {
        await initRenderer(page, layoutAdf, device);
      });
    });
  });
});
