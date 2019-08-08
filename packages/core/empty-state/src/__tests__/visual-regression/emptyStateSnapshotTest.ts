import {
  getExampleUrl,
  takeScreenShot,
} from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  it('Basic should match production example', async () => {
    const url = getExampleUrl(
      'core',
      'empty-state',
      'basic',
      // @ts-ignore
      global.__BASEURL__,
    );

    // @ts-ignore
    const image = await takeScreenShot(global.page, url);
    // Allow two percent tolerance for comparision
    // @ts-ignore
    expect(image).toMatchProdImageSnapshot({
      failureThreshold: '0.02',
      failureThresholdType: 'percent',
    });
  });
});
