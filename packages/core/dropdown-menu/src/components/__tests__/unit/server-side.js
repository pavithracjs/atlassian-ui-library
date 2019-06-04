/**
 * @jest-environment node
 */
// @flow

import React from 'react';
import { getExamplesFor } from '@atlaskit/build-utils/getExamples';
import ReactDOMServer from 'react-dom/server';

test('Dropdown menu server side rendering', async done => {
  (await getExamplesFor('dropdown-menu')).forEach(async (examples: any) => {
    // $StringLitteral
    const Example = require(examples.filePath).default; // eslint-disable-line import/no-dynamic-require
    expect(async () =>
      ReactDOMServer.renderToString(<Example />),
    ).not.toThrowError();
  });
  done();
});
