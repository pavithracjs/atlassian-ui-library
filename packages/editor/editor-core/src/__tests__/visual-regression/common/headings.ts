import { snapshot, initEditorWithAdf, Appearance } from '../_utils';
import headings from './__fixtures__/headings-adf.json';
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
      viewport: { width: 800, height: 800 },
    });
  });

  afterEach(async () => {
    await snapshot(page);
  });

  [1, 2, 3, 4, 5, 6].forEach(headingLevel => {
    it(`should render anchor link tooltip for h${headingLevel} correctly`, async () => {
      await page.waitForSelector(`h${headingLevel}:first-of-type`);
      await page.hover(`h${headingLevel}:first-of-type`);
      await page.hover(`h${headingLevel}:first-of-type button`);
      await waitForTooltip(page);
    });
  });
});
