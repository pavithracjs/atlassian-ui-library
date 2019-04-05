import { takeScreenShot } from '@atlaskit/visual-regression/helper';

describe('Snapshot Test', () => {
  it('Home page should match snapshot', async () => {
    const url = 'http://localhost:9000/';
    // @ts-ignore
    const image = await takeScreenShot(global.page, url);
    expect(image).toMatchProdImageSnapshot();
  });
});
