// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import { getExamplesFor } from '@atlaskit/build-utils/getExamples';
import { ssr } from '@atlaskit/ssr';
// eslint-disable-next-line import/no-extraneous-dependencies
import waitForExpect from 'wait-for-expect';

jest.spyOn(global.console, 'error').mockImplementation(() => {});

afterEach(() => {
  jest.resetAllMocks();
});
// TODO: https://ecosystem.atlassian.net/browse/AK-5988
test('should ssr then hydrate tree correctly', async () => {
  const [example] = await getExamplesFor('tree');
  // $StringLitteral
  const Example = await require(example.filePath).default; // eslint-disable-line import/no-dynamic-require

  const elem = document.createElement('div');
  elem.innerHTML = await ssr(example.filePath);

  ReactDOM.hydrate(<Example />, elem);
  await waitForExpect(() => {
    // ignore warnings caused by emotion's server-side rendering approach
    // eslint-disable-next-line no-console
    const mockCalls = console.error.mock.calls.filter(
      ([f, s]) =>
        !(
          f ===
            'Warning: Did not expect server HTML to contain a <%s> in <%s>.' &&
          s === 'style'
        ),
    );

    expect(mockCalls.length).toBe(0); // eslint-disable-line no-console
  });
});
