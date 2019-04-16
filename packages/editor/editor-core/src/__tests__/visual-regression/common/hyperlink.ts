import { initFullPageEditorWithAdf, snapshot } from '../_utils';
import { selectors } from '../../__helpers/page-objects/_editor';
import adf from './__fixtures__/hyperlink-adf.json';
// TODO: https://product-fabric.atlassian.net/browse/ED-6699
describe.skip('Hyperlink:', () => {
  let page: any;

  beforeAll(async () => {
    // @ts-ignore
    page = global.page;
    await initFullPageEditorWithAdf(page, adf);
  });

  afterEach(async () => {
    await snapshot(page, 0.02);
    await page.click(`${selectors.editor}`);
  });

  describe('heading', () => {
    it('should display the link toolbar', async () => {
      await page.click(`${selectors.editor} > h1 > a`);
    });
  });

  describe('paragraph', () => {
    it('should display the link toolbar', async () => {
      await page.click(`${selectors.editor} > p > a`);
    });
  });

  describe('action item', () => {
    it('should display the link toolbar', async () => {
      await page.click(`${selectors.editor} .taskItemView-content-wrap a`);
    });
  });

  describe('decision item', () => {
    it('should display the link toolbar', async () => {
      await page.click(`${selectors.editor} .decisionItemView-content-wrap a`);
    });
  });
});
