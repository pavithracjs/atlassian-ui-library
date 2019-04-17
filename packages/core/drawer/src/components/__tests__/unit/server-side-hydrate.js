// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import { getExamplesFor } from '@atlaskit/build-utils/getExamples';
import { ssr } from '@atlaskit/ssr';

jest.spyOn(global.console, 'error').mockImplementation();

afterEach(() => {
  jest.resetAllMocks();
});

/**
 * Skipping ssr tests while we investigate an issue with emotion 10 hydration errors
 * Ticket: https://ecosystem.atlassian.net/browse/AK-6059
 */
/* eslint-disable jest/no-disabled-tests */
test.skip('should ssr then hydrate drawer correctly', async () => {
  const [example] = await getExamplesFor('drawer');
  // $StringLitteral
  const Example = require(example.filePath).default; // eslint-disable-line import/no-dynamic-require

  const elem = document.createElement('div');
  elem.innerHTML = await ssr(example.filePath);

  ReactDOM.hydrate(<Example />, elem);
  expect(console.error).not.toBeCalled(); // eslint-disable-line no-console
});
