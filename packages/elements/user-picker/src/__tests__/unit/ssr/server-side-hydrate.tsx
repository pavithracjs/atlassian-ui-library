import { ssr_hydrate } from '@atlaskit/elements-test-helpers';

const ExamplesPath = '../../../../examples';

describe('server side rendering and hydration', async () => {
  beforeEach(() => {
    jest.spyOn(global.console, 'error');
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  test.each([
    ['00-single.tsx'],
    ['01-multi.tsx'],
    ['02-async-options-loading.tsx'],
    ['03-single-compact.tsx'],
    ['04-single-subtle.tsx'],
    ['05-single-subtle-and-compact.tsx'],
    ['09-watchers.tsx'],
    ['11-creatable.tsx'],
  ])('ssr("%s")', async (fileName: string) => {
    await ssr_hydrate(__dirname, `${ExamplesPath}/${fileName}`);

    // tslint:disable-next-line:no-console
    expect(console.error).not.toBeCalled();
  });

  test.skip.each([
    ['06-multi-with-default-values.tsx'], // TODO: https://product-fabric.atlassian.net/browse/FS-3704
    ['07-multi-with-fixed-values.tsx'], // TODO: https://product-fabric.atlassian.net/browse/FS-3704
    ['08-single-disabled.tsx'], // TODO: https://product-fabric.atlassian.net/browse/FS-3704
    ['10-in-a-table-cell.tsx'], // depends on document (DOM)
  ])('ssr("%s")', async (fileName: string) => {
    await ssr_hydrate(__dirname, `${ExamplesPath}/${fileName}`);

    // tslint:disable-next-line:no-console
    expect(console.error).not.toBeCalled();
  });
});
