import {
  getExampleUrl,
  takeScreenShot,
} from '@atlaskit/visual-regression/helper';

type Global = NodeJS.Global & { __BASEURL__: string; page: string };

describe('Snapshot Test', () => {
  it('Icon size example should match production example', async () => {
    const url = getExampleUrl(
      'core',
      'icon',
      'size-example',
      (global as Global).__BASEURL__,
    );
    const image = await takeScreenShot((global as Global).page, url);
    //$FlowFixMe
    expect(image).toMatchProdImageSnapshot();
  });
});
