import { snapshot, Device, initRendererWithADF } from '../_utils';
import * as resizeAdf from './__fixtures__/renderer-media.adf.json';
import * as layoutAdf from '../../../../examples/helper/media-resize-layout.adf.json';
import { selectors as mediaSelectors } from '../../__helpers/page-objects/_media';
import { selectors as rendererSelectors } from '../../__helpers/page-objects/_renderer';
import { Page } from 'puppeteer';

const devices = [
  Device.LaptopHiDPI,
  Device.LaptopMDPI,
  Device.iPad,
  Device.iPadPro,
  Device.iPhonePlus,
];

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
    await page.waitForSelector(mediaSelectors.errorLoading); // In test should show overlay error
    await page.waitForSelector(rendererSelectors.document);
    await snapshot(page, {}, rendererSelectors.document);
  });

  describe('resize', () => {
    devices.forEach(device => {
      // TODO: ED-7455
      it.skip(`should correctly render for ${device}`, async () => {
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
