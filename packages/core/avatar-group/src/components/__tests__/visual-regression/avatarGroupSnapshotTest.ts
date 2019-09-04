import {
  getExampleUrl,
  takeScreenShot,
} from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  it('Playground avatar group example should match production example', async () => {
    const url = getExampleUrl(
      'core',
      'avatar-group',
      'avatarGroupPlayground',
      // @ts-ignore
      global.__BASEURL__,
    );
    // @ts-ignore
    const image = await takeScreenShot(global.page, url);
    expect(image).toMatchProdImageSnapshot();
  });
});
