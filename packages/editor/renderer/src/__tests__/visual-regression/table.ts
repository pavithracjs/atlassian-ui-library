import {
  goToRendererTestingExample,
  snapshot,
  mountRenderer,
  animationFrame,
} from './_utils';
import { wideTableResized } from './__fixtures__/document-tables';
import * as tableWithShadowAdf from './__fixtures__/table-with-shadow.adf.json';
import { Page } from 'puppeteer';

describe('Snapshot Test: Table scaling', () => {
  let page: Page;
  beforeAll(async () => {
    // @ts-ignore
    page = global.page;
    await page.setViewport({ width: 1485, height: 1175 });
    await goToRendererTestingExample(page);
  });

  it(`should NOT render a right shadow`, async () => {
    await mountRenderer(page, {
      showSidebar: true,
      appearance: 'full-page',
      document: wideTableResized,
    });

    await animationFrame(page);
    await snapshot(page, 0.002);
  });

  it(`should not overlap inline comments dialog`, async () => {
    await mountRenderer(page, {
      showSidebar: true,
      appearance: 'full-page',
      document: tableWithShadowAdf,
    });

    await page.evaluate(() => {
      let div = document.createElement('div');
      div.className = '__fake_inline_comment__';
      document.body.appendChild(div);
    });

    const css = `
    .__fake_inline_comment__ {
      position: absolute;
      right: 50px;
      top: 300px;
      width: 300px;
      height: 200px;
      background: white;
      border: 1px solid red;
    }
    `;
    await page.addStyleTag({ content: css });

    await animationFrame(page);
    await snapshot(page, 0.002);
  });
});
