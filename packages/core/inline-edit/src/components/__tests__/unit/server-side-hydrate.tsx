import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { getExamplesFor } from '@atlaskit/build-utils/getExamples';
import { ssr } from '@atlaskit/ssr';

// @ts-ignore
jest.spyOn(global.console, 'error');

afterEach(() => {
  jest.resetAllMocks();
});

test('should ssr then hydrate inline-edit correctly', async () => {
  const [example] = await getExamplesFor('inline-edit');
  const Example = require(example.filePath).default;

  const elem = document.createElement('div');
  elem.innerHTML = await ssr(example.filePath);

  ReactDOM.hydrate(<Example />, elem);
  // eslint-disable-next-line no-console
  expect(console.error).not.toBeCalled();
});
