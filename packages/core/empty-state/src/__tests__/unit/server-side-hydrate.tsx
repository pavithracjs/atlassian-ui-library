import React from 'react';
import ReactDOM from 'react-dom';
import { getExamplesFor } from '@atlaskit/build-utils/getExamples';
import { ssr } from '@atlaskit/ssr';
import waitForExpect from 'wait-for-expect';

jest.spyOn(global.console, 'error').mockImplementation(() => {});

beforeEach(() => {
  jest.setTimeout(10000);
});

afterEach(() => {
  jest.resetAllMocks();
});
// https://product-fabric.atlassian.net/browse/BUILDTOOLS-282: SSR tests are still timing out in Landkid.
test.skip('should ssr then hydrate empty-state correctly', async () => {
  const [example] = await getExamplesFor('empty-state');
  const Example = await require(example.filePath).default; // eslint-disable-line import/no-dynamic-require

  const elem = document.createElement('div');
  elem.innerHTML = await ssr(example.filePath);

  await waitForExpect(() => {
    ReactDOM.hydrate(<Example />, elem);
    // eslint-disable-next-line no-console
    const mockCalls = (console.error as jest.Mock).mock.calls.filter(
      ([f, s]) =>
        !(
          f ===
            'Warning: Did not expect server HTML to contain a <%s> in <%s>.' &&
          s === 'style'
        ),
    );
    expect(mockCalls.length).toBe(0);
  });
});
