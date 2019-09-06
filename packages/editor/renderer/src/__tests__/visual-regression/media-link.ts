import { snapshot, initRendererWithADF } from './_utils';
import mediaLink from './__fixtures__/media-link.adf.json';
import { Page } from 'puppeteer';

describe('media link:', () => {
  let page: Page;

  beforeEach(async () => {
    // @ts-ignore
    page = global.page;
    await initRendererWithADF(page, {
      adf: mediaLink,
      appearance: 'full-page',
    });
  });

  it(`should have opacity 0.8 when hover media link`, async () => {
    await page.waitForSelector(`a:first-of-type`);
    await page.hover(`a:first-of-type`);
    page.waitFor(1000);
    await snapshot(page);
  });
});
