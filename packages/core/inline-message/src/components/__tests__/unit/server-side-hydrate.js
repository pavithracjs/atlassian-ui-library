// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import { getExamplesFor } from '@atlaskit/build-utils/getExamples';
import { ssr } from '@atlaskit/ssr';

jest.spyOn(global.console, 'error');

// Warning from React referring to @emotion's injected style tag
const warningRegEx = new RegExp(
  'Warning: Did not expect server HTML to contain a <style*',
);

afterEach(() => {
  jest.resetAllMocks();
});

test('should ssr then hydrate inline-message correctly', async () => {
  const [example] = await getExamplesFor('inline-message');
  // $StringLitteral
  const Example = require(example.filePath).default; // eslint-disable-line import/no-dynamic-require

  const elem = document.createElement('div');
  elem.innerHTML = await ssr(example.filePath);

  ReactDOM.hydrate(<Example />, elem);
  const mockCalls = console.error.mock.calls[0]; // eslint-disable-line no-console
  const mockCallsWithoutStyleErrors = mockCalls.filter(
    call => !warningRegEx.test(call),
  );
  expect(mockCallsWithoutStyleErrors).toHaveLength(0);
});
