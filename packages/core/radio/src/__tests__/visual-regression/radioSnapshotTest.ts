import {
  getExampleUrl,
  takeScreenShot,
} from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  it(`Basic usage example should match prod`, async () => {
    const url = getExampleUrl(
      'core',
      'radio',
      'basic-usage',
      //@ts-ignore - global usage
      global.__BASEURL__,
    );
    //@ts-ignore - global usage
    const image = await takeScreenShot(global.page, url);
    expect(image).toMatchProdImageSnapshot();
  });
});
