import {
  getExampleUrl,
  takeScreenShot,
} from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  it('Theme colors should match production example', async () => {
    // @ts-ignore
    const url = getExampleUrl('core', 'theme', 'colors', global.__BASEURL__);
    // @ts-ignore
    const image = await takeScreenShot(global.page, url);
    expect(image).toMatchProdImageSnapshot();
  });
});
