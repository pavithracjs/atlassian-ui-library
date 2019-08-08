import React from 'react';
import ReactDOM from 'react-dom';
import { getExamplesFor } from '@atlaskit/build-utils/getExamples';
import { ssr, mockConsole } from '@atlaskit/ssr';

const getConsoleMockCalls = mockConsole(console);
beforeAll(() => {
  jest.setTimeout(30000);
});
afterEach(() => {
  jest.resetAllMocks();
});

test('should ssr then hydrate media-client correctly', async () => {
  const [example] = await getExamplesFor('media-client');
  const Example = await require(example.filePath).default;
  const elem = document.createElement('div');
  elem.innerHTML = await ssr(example.filePath);

  ReactDOM.hydrate(<Example />, elem);

  const mockCalls = getConsoleMockCalls();
  expect(mockCalls.length).toBe(0);
});
