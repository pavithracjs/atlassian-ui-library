import {
  getExampleUrl,
  takeScreenShot,
} from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  // You can't use other example as they create dynamic content and will fail the test
  it('Empty view example should match production example', async () => {
    const url = getExampleUrl(
      'core',
      'dynamic-table',
      'empty-view-with-body',
      // @ts-ignore - Property '__BASEURL__' does not exist on type 'Global'.
      global.__BASEURL__,
    );
    // @ts-ignore - Property 'page' does not exist on type 'Global'.
    const image = await takeScreenShot(global.page, url);
    // @ts-ignore - Expected 0 arguments, but got 1.
    expect(image).toMatchProdImageSnapshot(0.01);
  });
});
