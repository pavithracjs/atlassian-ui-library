import { ssr_hydrate } from '@atlaskit/elements-test-helpers';

const ExamplesPath = '../../../../examples';

// Warning from React referring to @emotion's injected style tag
const warningRegEx = new RegExp(
  'Warning: Did not expect server HTML to contain a <style*',
);

describe('server side rendering and hydration', async () => {
  beforeEach(() => {
    jest.spyOn(global.console, 'error');
  });

  afterEach(() => {
    jest.resetAllMocks();
    jest.restoreAllMocks();
  });

  test.each([['00-simple-status.tsx']])(
    'ssr("%s")',
    async (fileName: string) => {
      await ssr_hydrate(__dirname, `${ExamplesPath}/${fileName}`);

      // @ts-ignore
      // eslint-disable-next-line no-console
      const mockCalls = console.error.mock.calls;
      const filtered = mockCalls.filter(
        (mock: any) => !warningRegEx.test(mock),
      );
      const mockCallsWithoutStyleErrors = filtered.reduce(
        (a: any, v: any) => a.concat(v),
        [],
      );
      expect(mockCallsWithoutStyleErrors).toHaveLength(0);
    },
  );
});
