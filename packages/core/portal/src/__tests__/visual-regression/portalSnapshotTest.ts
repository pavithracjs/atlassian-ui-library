import {
  getExampleUrl,
  takeScreenShot,
} from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  it(`Portal stacking context should match prod`, async () => {
    const url = getExampleUrl(
      'core',
      'portal',
      'stacking-context',
      // @ts-ignore -  global usage
      global.__BASEURL__,
    );
    // @ts-ignore -  global usage
    const image = await takeScreenShot(global.page, url);
    expect(image).toMatchProdImageSnapshot();
  });
});
