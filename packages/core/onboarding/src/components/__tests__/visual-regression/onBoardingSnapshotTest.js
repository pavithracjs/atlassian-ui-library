// @flow
import {
  getExampleUrl,
  takeScreenShot,
  takeElementScreenShot,
} from '@atlaskit/visual-regression/helper';

const openModalBtn = "[type='button']";
const modalDialog = "[role='dialog']";

describe('Snapshot Test', () => {
  it('Spotlight different-spotlights should match production example', async () => {
    const url = getExampleUrl(
      'core',
      'onboarding',
      'different-spotlights',
      global.__BASEURL__,
    );
    const image = await takeScreenShot(global.page, url);
    //$FlowFixMe
    expect(image).toMatchProdImageSnapshot();
  });

  it('Modal Basic example should match production example', async () => {
    const url = getExampleUrl(
      'core',
      'onboarding',
      'modal-basic',
      global.__BASEURL__,
    );
    const { page } = global;

    await page.goto(url);
    await page.waitForSelector(openModalBtn);
    await page.click(openModalBtn);
    await page.waitForSelector(modalDialog);
    // We need to wait for the animation to finish.
    await page.waitFor(1000);

    const image = await takeElementScreenShot(page, modalDialog);
    //$FlowFixMe
    expect(image).toMatchProdImageSnapshot();
  });
});
