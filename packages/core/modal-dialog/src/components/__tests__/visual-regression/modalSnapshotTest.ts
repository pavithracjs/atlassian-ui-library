import {
  getExampleUrl,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

const openModalBtn = "[type='button']";
const modalDialog = "[role='dialog']";

// TODO: https://ecosystem.atlassian.net/browse/AK-5842
describe.skip('Snapshot Test', () => {
  it('Basic example should match production example', async () => {
    const url = getExampleUrl(
      'core',
      'modal-dialog',
      'basic',
      // @ts-ignore custom properties on global are untyped
      global.__BASEURL__,
    );
    // @ts-ignore custom properties on global are untyped
    const { page } = global;

    await page.goto(url);
    await page.waitForSelector(openModalBtn);
    await page.click(openModalBtn);
    await page.waitFor(modalDialog);

    const image = await takeElementScreenShot(page, modalDialog);
    expect(image).toMatchProdImageSnapshot();
  });
});
