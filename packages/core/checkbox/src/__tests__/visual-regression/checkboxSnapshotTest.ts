import {
  getExampleUrl,
  takeScreenShot,
} from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  it('Basic usage example should match production example', async () => {
    const url = getExampleUrl(
      'core',
      'checkbox',
      'basic-usage',
      // @ts-ignore - Property '__BASEURL__' does not exist
      global.__BASEURL__,
    );
    // @ts-ignore - Property 'page' does not exist
    const image = await takeScreenShot(global.page, url);
    expect(image).toMatchProdImageSnapshot();
  });
});
