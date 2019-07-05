import {
  getExampleUrl,
  takeScreenShot,
} from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  it('Icon size example should match production example', async () => {
    const url = getExampleUrl(
      'core',
      'icon',
      'size-example',
      // @ts-ignore - Property '__BASEURL__' does not exist on type 'Global'.
      global.__BASEURL__,
    );

    // @ts-ignore - Property 'page' does not exist on type 'Global'
    const image = await takeScreenShot(global.page, url);

    expect(image).toMatchProdImageSnapshot();
  });
});
