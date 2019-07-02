import React from 'react';
import ReactDOM from 'react-dom';
import { getExamplesFor } from '@atlaskit/build-utils/getExamples';
import { ssr, mockConsole } from '@atlaskit/ssr';

const getConsoleMockCalls = mockConsole(console);

afterEach(() => {
  jest.resetAllMocks();
});

// TODO: failing due to whatwg-fetch issues. Re-enable once fixed
test('should ssr then hydrate media-core correctly', async () => {
  const [example] = await getExamplesFor('media-core');
  const Example = await require(example.filePath).default; // eslint-disable-line import/no-dynamic-require

  const elem = document.createElement('div');
  elem.innerHTML = await ssr(example.filePath);

  ReactDOM.hydrate(<Example />, elem);
  const mockCalls = getConsoleMockCalls();
  expect(mockCalls.length).toBe(0);
});
