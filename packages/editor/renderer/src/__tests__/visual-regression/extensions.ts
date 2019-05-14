import { Page } from 'puppeteer';
import { goToRendererTestingExample, mountRenderer, snapshot } from './_utils';
import * as nestedIframe from '../__fixtures__/extension-iframe-nested.adf.json';
import * as breakoutExtensions from './__fixtures__/extension-breakout.adf.json';

describe('Snapshot Test: Extensions', () => {
  let page: Page;
  beforeEach(async () => {
    // @ts-ignore
    page = global.page;
    await goToRendererTestingExample(page);
    await page.setViewport({ width: 1120, height: 700 });
  });

  it('should correctly stay within their parent layout regardless of specified width', async () => {
    await mountRenderer(page, {
      document: nestedIframe,
      appearance: 'full-page',
    });
    await snapshot(page);
  });

  it('should correctly render breakout extensions', async () => {
    await mountRenderer(page, {
      document: breakoutExtensions,
      appearance: 'full-page',
    });
    await snapshot(page);
  });
});
