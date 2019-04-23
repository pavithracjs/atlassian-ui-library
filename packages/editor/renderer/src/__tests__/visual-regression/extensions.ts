import { Page } from 'puppeteer';
import { goToRendererTestingExample, mountRenderer, snapshot } from './_utils';
import * as nestedIframe from '../__fixtures__/extension-iframe-nested.adf.json';

describe('Snapshot Test: Extensions', () => {
  let page: Page;
  beforeEach(async () => {
    // @ts-ignore
    page = global.page;
    await goToRendererTestingExample(page);
    await page.setViewport({ width: 1120, height: 700 });
  });

  it('iFrame should correctly stay within its parent layout', async () => {
    await mountRenderer(page, {
      document: nestedIframe,
      appearance: 'full-page',
    });
    await snapshot(page);
  });
});
