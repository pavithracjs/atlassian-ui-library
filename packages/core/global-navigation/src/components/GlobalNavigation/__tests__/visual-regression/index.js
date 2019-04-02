// @flow
import {
  getExampleUrl,
  takeScreenShot,
} from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  it('Basic global navigation should match prod', async () => {
    const url = getExampleUrl(
      'core',
      'global-navigation',
      'basic-global-navigation',
      global.__BASEURL__,
    );
    const image = await takeScreenShot(global.page, url);
    //$FlowFixMe
    expect(image).toMatchProdImageSnapshot();
  });

  it('with-notification-integration should match prod', async () => {
    const url = getExampleUrl(
      'core',
      'global-navigation',
      'with-notification-integration',
      global.__BASEURL__,
    );
    const image = await takeScreenShot(global.page, url);
    //$FlowFixMe
    expect(image).toMatchProdImageSnapshot();
  });

  it('dropdown example should match prod', async () => {
    const url = getExampleUrl(
      'core',
      'global-navigation',
      'with-dropdowns',
      global.__BASEURL__,
    );
    const { page } = global;
    const button = '#profileGlobalItem';
    await page.goto(url);
    await page.waitForSelector(button);

    await page.click(button);
    await page.waitFor(300);

    const image = await page.screenshot();
    //$FlowFixMe
    expect(image).toMatchProdImageSnapshot();
  });

  it('drawer example should match prod', async () => {
    const url = getExampleUrl(
      'core',
      'global-navigation',
      'with-drawers-and-modal',
      global.__BASEURL__,
    );
    const { page } = global;
    const button = '#starDrawerGlobalItem';
    await page.goto(url);
    await page.waitForSelector(button);

    await page.click(button);
    await page.waitFor(300);

    const image = await page.screenshot();
    //$FlowFixMe
    expect(image).toMatchProdImageSnapshot();
  });

  it('changeboarding example should match prod', async () => {
    const url = getExampleUrl(
      'core',
      'global-navigation',
      'with-changeboarding',
      global.__BASEURL__,
    );
    const { page } = global;
    const button = '[data-test-id="Navigation"] + div button';
    await page.goto(url);
    await page.waitForSelector(button);

    await page.click(button);
    await page.waitFor(300);

    const image = await page.screenshot();
    //$FlowFixMe
    expect(image).toMatchProdImageSnapshot();
  });
});
