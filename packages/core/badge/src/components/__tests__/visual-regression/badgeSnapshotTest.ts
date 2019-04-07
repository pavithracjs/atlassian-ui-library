import {
  getExampleUrl,
  takeScreenShot,
} from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  it('badge basic example should match production example', async () => {
    // @ts-ignore custom properties on global are untyped
    const url = getExampleUrl('core', 'badge', 'basic', global.__BASEURL__);
    // @ts-ignore custom properties on global are untyped
    const image = await takeScreenShot(global.page, url);

    expect(image).toMatchProdImageSnapshot();
  });
});
