import React from 'react';
import ReactDOM from 'react-dom';
import { getExamplesFor } from '@atlaskit/build-utils/getExamples';
import { ssr, mockConsole } from '@atlaskit/ssr';
import waitForExpect from 'wait-for-expect';

let getConsoleMockCalls: any;

beforeAll(() => {
  jest.setTimeout(10000);
  getConsoleMockCalls = mockConsole(console);
});

afterEach(() => {
  jest.resetAllMocks();
  jest.restoreAllMocks();
});

test('should ssr then hydrate media-viewer correctly', async () => {
  const [example] = await getExamplesFor('media-viewer');
  const Example = await require(example.filePath).default;
  const elem = document.createElement('div');
  elem.innerHTML = await ssr(example.filePath);

  ReactDOM.hydrate(<Example />, elem);
  await waitForExpect(() => {
    const mockCalls = getConsoleMockCalls();
    expect(mockCalls.length).toBe(0);
  });
});
