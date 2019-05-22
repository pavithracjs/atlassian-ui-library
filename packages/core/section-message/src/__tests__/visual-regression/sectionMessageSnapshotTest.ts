import {
  getExampleUrl,
  takeScreenShot,
} from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  it('Appearance variations should match production example', async () => {
    const url = getExampleUrl(
      'core',
      'section-message',
      'appearance-variations',
      // @ts-ignore - global usage
      global.__BASEURL__,
    );
    // @ts-ignore - global usage
    const image = await takeScreenShot(global.page, url);
    expect(image).toMatchProdImageSnapshot();
  });
});
