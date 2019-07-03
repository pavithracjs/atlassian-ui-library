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
});

test.skip('should ssr then hydrate media-card correctly', async () => {
  const [example] = await getExamplesFor('media-card');
  const Example = await require(example.filePath).default; // eslint-disable-line import/no-dynamic-require
  const elem = document.createElement('div');
  elem.innerHTML = await ssr(example.filePath);

  await waitForExpect(() => {
    ReactDOM.hydrate(<Example />, elem);
    const mockCalls = getConsoleMockCalls();
    expect(mockCalls.length).toBe(0);
  });
});
