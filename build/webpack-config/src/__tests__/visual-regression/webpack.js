// @flow
import { takeElementScreenShot } from '@atlaskit/visual-regression/helper';

const app = '#app';
const defaultView = '[spacing="cosy"]';
const atlaskitTitle = 'h1';

describe('Webpack Website Snapshot >', () => {
  it('Home page title should match production', async () => {
    const url = global.__BASEURL__;
    const { page } = global;
    await page.goto(url, { waitUntil: 'networkidle0' });
    await page.waitForSelector(app);
    await page.setViewport({ width: 1800, height: 1000 });
    await page.waitForSelector(defaultView);
    const image = await takeElementScreenShot(page, atlaskitTitle);
    // $FlowFixMe
    expect(image).toMatchProdImageSnapshot();
  });
});
