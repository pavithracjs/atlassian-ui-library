import { MINIMUM_THRESHOLD } from '@atlaskit/visual-regression/helper';
import { snapshot, initRendererWithADF } from './_utils';
import * as document from '../__fixtures__/document-without-media.adf.json';
import { Page } from 'puppeteer';

const initRenderer = async (
  page: Page,
  viewport: { width: number; height: number },
) => {
  await initRendererWithADF(page, {
    appearance: 'full-width',
    viewport,
    rendererProps: { allowDynamicTextSizing: true },
    adf: document,
  });
};

describe('Snapshot Test: Full Width', () => {
  let page: Page;
  beforeAll(() => {
    // @ts-ignore
    page = global.page;
  });

  afterEach(async () => {
    await snapshot(page, MINIMUM_THRESHOLD);
  });

  [{ width: 2000, height: 2700 }, { width: 1420, height: 2500 }].forEach(
    viewport => {
      it(`should correctly render ${viewport.width}`, async () => {
        await initRenderer(page, viewport);
      });
    },
  );
});
