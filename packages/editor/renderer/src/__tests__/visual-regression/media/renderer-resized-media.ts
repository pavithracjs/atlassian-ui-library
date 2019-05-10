import {
  snapshot,
  deviceViewPorts,
  Device,
  mountRenderer,
  goToRendererTestingExample,
} from '../_utils';
import adf from '../../../../examples/helper/media-resize-layout.adf.json';
import { selectors as rendererSelectors } from '../../__helpers/page-objects/_renderer';
import { parseAndInlineAdfMedia } from '@atlaskit/editor-test-helpers';
import { waitForLoadedImageElements } from '@atlaskit/visual-regression/helper';
import { Page } from 'puppeteer';

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

    beforeAll(async () => {
      // @ts-ignore
      page = global.page;
      await goToRendererTestingExample(page);
    });

    describe('resized media layout', () => {
      devices.forEach(device => {
        it(`should correctly render ${device}`, async () => {
          await page.setViewport(deviceViewPorts[device]);
          await mountRenderer(page, {
            appearance: 'full-page',
            allowDynamicTextSizing: true,
            document: parseAndInlineAdfMedia(adf),
          });
          await page.waitForSelector(rendererSelectors.document);
          await waitForLoadedImageElements(page, 1000, 0); // 1 second timeout and no media API delay.
          await snapshot(page, 0.01, rendererSelectors.document);
        });
      });
    });
  });
});
