import {
  getExampleUrl,
  takeScreenShot,
} from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  it('Basic should match production example', async () => {
    const url = getExampleUrl(
      'core',
      'inline-edit',
      'variations',
      // @ts-ignore
      global.__BASEURL__,
    );
    const image = await takeScreenShot(
      // @ts-ignore
      global.page,
      url,
    );
    expect(image).toMatchProdImageSnapshot();
  });
});
