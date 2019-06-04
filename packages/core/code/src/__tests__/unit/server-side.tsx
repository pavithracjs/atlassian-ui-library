/**
 * @jest-environment node
 */

import React from 'react';
import { getExamplesFor } from '@atlaskit/build-utils/getExamples';
import ReactDOMServer from 'react-dom/server';

test('Code server side rendering', async done => {
  (await getExamplesFor('code')).forEach((examples: { filePath: string }) => {
    const Example = require(examples.filePath).default; // eslint-disable-line import/no-dynamic-require
    expect(async () =>
      ReactDOMServer.renderToString(<Example />),
    ).not.toThrowError();
  });
  done();
});
