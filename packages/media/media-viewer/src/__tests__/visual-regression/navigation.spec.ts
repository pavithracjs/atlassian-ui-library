import {
  getExampleUrl,
  pageSelector,
} from '@atlaskit/visual-regression/helper';
import { sleep } from '../../../../media-test-helpers';

describe('Media Viewer Navigation', () => {
  const url = getExampleUrl(
    'media',
    'media-viewer',
    'mocked-viewer',
    // @ts-ignore
    global.__BASEURL__,
  );

  it('renders a file and nav button given multiple files', async () => {
    // @ts-ignore
    const { page } = global;

    await page.goto(url);
    await page.waitForSelector(pageSelector);
    await page.waitForSelector('img');
    await page.waitForFunction(
      `window.areControlsRendered() && window.areControlsVisible()`,
    );
    await sleep(500);
    const image = await page.screenshot();

    expect(image).toMatchProdImageSnapshot();
  });

  it('hides nav for multiple files after a timeout', async () => {
    // @ts-ignore
    const { page } = global;

    await page.goto(url);
    await page.waitForSelector(pageSelector);
    await page.waitForSelector('img');
    await page.waitForFunction(
      `window.areControlsRendered() && !window.areControlsVisible()`,
    );
    await sleep(500);
    const image = await page.screenshot();

    expect(image).toMatchProdImageSnapshot();
  });
});
