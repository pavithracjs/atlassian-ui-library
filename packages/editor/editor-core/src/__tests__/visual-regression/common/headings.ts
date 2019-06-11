import { snapshot, initEditorWithAdf, Appearance } from '../_utils';
import headings from './__fixtures__/headings.json';
import { waitForTooltip } from '@atlaskit/visual-regression/helper';

describe('Heading:', () => {
  let page: any;

  beforeEach(async () => {
    // @ts-ignore
    page = global.page;
    await initEditorWithAdf(page, {
      adf: headings,
      editorProps: { allowHeadingAnchorLink: true },
      appearance: Appearance.fullPage,
      viewport: { width: 800, height: 1400 },
    });
  });

  afterEach(async () => {
    await snapshot(page);
  });

  it('should render anchor link tooltip correctly', async () => {
    await page.waitForSelector('.headingView-content-wrap:first-of-type');
    await page.hover('.headingView-content-wrap:first-of-type');
    await page.hover('.copy-anchor:first-of-type');
    await waitForTooltip(page);
  });
});
