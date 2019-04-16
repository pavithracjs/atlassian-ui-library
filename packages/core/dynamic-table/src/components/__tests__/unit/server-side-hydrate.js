// @flow
import React from 'react';
import ReactDOM from 'react-dom';
import { getExamplesFor } from '@atlaskit/build-utils/getExamples';
import { ssr } from '@atlaskit/ssr';

jest.spyOn(global.console, 'error');

afterEach(() => {
  jest.resetAllMocks();
});

/**
 * Skipping ssr tests while we investigate an issue with emotion 10 hydration errors
 * Ticket: https://ecosystem.atlassian.net/browse/AK-6059
 * */

test('should ssr then hydrate dynamic-table correctly', async () => {
  const [example] = await getExamplesFor('dynamic-table');
  // $StringLitteral
  const Example = require(example.filePath).default; // eslint-disable-line import/no-dynamic-require

  const elem = document.createElement('div');
  elem.innerHTML = await ssr(example.filePath);

  ReactDOM.hydrate(<Example />, elem);
  // ignore emotion errors in server
  const ignorePattern = /Did not expect server HTML to contain a <style> in <div>./;
  // eslint-disable-next-line no-console
  const mockCalls = console.error.mock.calls.filter(
    e => !e[0].match(ignorePattern),
  );

  expect(mockCalls.length).toBe(0); // eslint-disable-line no-console
});
