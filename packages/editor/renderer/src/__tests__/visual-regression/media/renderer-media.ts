import {
  snapshot,
  deviceViewPorts,
  Device,
  goToRendererTestingExample,
  mountRenderer,
} from '../_utils';
import mediaAdf from './__fixtures__/renderer-media.adf.json';
import { selectors as rendererSelectors } from '../../__helpers/page-objects/_renderer';
import { Page } from 'puppeteer';
import { parseAndInlineAdfMedia } from '@atlaskit/editor-test-helpers';
import { waitForLoadedImageElements } from '@atlaskit/visual-regression/helper';

const devices = [
  Device.LaptopHiDPI,
  Device.LaptopMDPI,
  Device.iPad,
  Device.iPadPro,
  Device.iPhonePlus,
];

describe('Snapshot Test: Media', () => {
  describe('renderer', () => {
    let page: Page;

    const adf = parseAndInlineAdfMedia(mediaAdf);

    beforeAll(async () => {
      // @ts-ignore
      page = global.page;
      await goToRendererTestingExample(page);
    });

    describe('media layout', () => {
      devices.forEach(device => {
        it(`should correctly render ${device}`, async () => {
          await page.setViewport(deviceViewPorts[device]);
          await mountRenderer(page, {
            appearance: 'full-page',
            allowDynamicTextSizing: true,
            document: adf,
          });
          await page.waitForSelector(rendererSelectors.document);
          await waitForLoadedImageElements(page, 1000); // 1 second timeout for inlined media.
          await snapshot(page, 0.01, rendererSelectors.document);
        });
      });
    });
  });
});
