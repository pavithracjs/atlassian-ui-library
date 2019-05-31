import {
  getExampleUrl,
  takeScreenShot,
} from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  it('Inline message basic should match production example', async () => {
    const url = getExampleUrl(
      'core',
      'inline-message',
      'basic',
      // @ts-ignore - global usage
      global.__BASEURL__,
    );
    // @ts-ignore - global usage
    const image = await takeScreenShot(global.page, url);
    expect(image).toMatchProdImageSnapshot();
  });
  it('Inline message different-types should match production example', async () => {
    const url = getExampleUrl(
      'core',
      'inline-message',
      'different-types',
      // @ts-ignore - global usage
      global.__BASEURL__,
    );
    // @ts-ignore - global usage
    const image = await takeScreenShot(global.page, url);
    expect(image).toMatchProdImageSnapshot();
  });
});
