import { Page } from 'puppeteer';
import { goToRendererTestingExample, mountRenderer, snapshot } from './_utils';
import { layoutWithDefaultBreakoutMark } from './__fixtures__/document-with-layout-default-breakout';
import * as layout2Col from '../__fixtures__/layout-2-columns.adf.json';
import * as layout3Col from '../__fixtures__/layout-3-columns.adf.json';
import * as layoutLeftSidebar from '../__fixtures__/layout-left-sidebar.adf.json';
import * as layoutRightSidebar from '../__fixtures__/layout-right-sidebar.adf.json';
import * as layout3ColWithSidebars from '../__fixtures__/layout-3-columns-with-sidebars.adf.json';

describe('Snapshot Test: Layouts', () => {
  let page: Page;

  const layouts = [
    { name: '2 columns', adf: layout2Col },
    { name: '3 columns', adf: layout3Col },
    { name: 'left sidebar', adf: layoutLeftSidebar },
    { name: 'right sidebar', adf: layoutRightSidebar },
    { name: '3 columns with sidebars', adf: layout3ColWithSidebars },
  ];

  beforeAll(async () => {
    // @ts-ignore
    page = global.page;
    await goToRendererTestingExample(page);
    await page.setViewport({ width: 1120, height: 700 });
  });

  describe('Columns', () => {
    layouts.forEach(layout => {
      it(`should correctly render "${layout.name}" layout`, async () => {
        await mountRenderer(page, {
          document: layout.adf,
          appearance: 'full-page',
        });
        await snapshot(page);
      });
    });
  });

  describe('Breakout Mark', () => {
    it(`should correctly render three column layout with a default breakout mark`, async () => {
      await mountRenderer(page, {
        document: layoutWithDefaultBreakoutMark,
        appearance: 'full-page',
      });
      await snapshot(page, 0.02);
    });
  });
});
