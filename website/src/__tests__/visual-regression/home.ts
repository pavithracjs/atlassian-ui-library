import { takeElementScreenShot } from '@atlaskit/visual-regression/helper';

const app = '#app';
const defaultView = '[spacing="cosy"]';
const atlaskitLogo = '[alt="Atlaskit logo"]';
const atlaskitTitle = 'h1';

describe('Snapshot Test', () => {
  let page: any;
  let url: string;

  beforeAll(async () => {
    // @ts-ignore
    url = global.__BASEURL__;
    // @ts-ignore
    page = global.page;
    await page.goto(url, { waitUntil: 'networkidle0' });
    await page.waitForSelector(app);
    await page.setViewport({ width: 1800, height: 1000 });
    await page.waitForSelector(defaultView);
  });

  it('Home page title should match production', async () => {
    const image = await takeElementScreenShot(page, atlaskitTitle);
    expect(image).toMatchProdImageSnapshot();
  });
  it('Home page logo should match production', async () => {
    const image = await takeElementScreenShot(page, atlaskitLogo);
    expect(image).toMatchProdImageSnapshot();
  });
  // TODO: adding for testing
  it('Testing page logo should match production', async () => {
    const image = await takeElementScreenShot(page, atlaskitLogo);
    expect(image).toMatchProdImageSnapshot();
  });
  it('Home page cards should match production', async () => {
    // The animation requires to wait couple of seconds to have the cards to be loaded.
    await page.waitFor(5000);
    const cards = await page.$$('a');
    // The element 0 is the logo of Atlaskit, already covered by the test above.
    for (let i = 1; i < cards.length; i++) {
      let image = await cards[i].screenshot();
      expect(image).toMatchProdImageSnapshot();
    }
  });
});
