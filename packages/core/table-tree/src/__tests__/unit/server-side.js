/**
 * @jest-environment node
 */
// @flow
import React from 'react';
import { getExamplesFor } from '@atlaskit/build-utils/getExamples';
import ReactDOMServer from 'react-dom/server';

test('Table-tree server side rendering', async done => {
  (await getExamplesFor('table-tree')).forEach(async (examples: any) => {
    // $StringLitteral
    const Example = require(examples.filePath).default; // eslint-disable-line import/no-dynamic-require
    expect(async () =>
      ReactDOMServer.renderToString(<Example />),
    ).not.toThrowError();
  });
  done();
});
