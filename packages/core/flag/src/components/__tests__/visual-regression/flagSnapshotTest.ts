import {
  getExampleUrl,
  takeScreenShot,
} from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  it('Flag-without-flagGroup should match production example', async () => {
    const url = getExampleUrl(
      'core',
      'flag',
      'flag-without-flagGroup',
      //@ts-ignore - global usage
      global.__BASEURL__,
    );
    //@ts-ignore - global usage
    const image = await takeScreenShot(global.page, url);
    expect(image).toMatchProdImageSnapshot();
  });
});
