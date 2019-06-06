/**
 * @jest-environment node
 */
// @flow
import React from 'react';
import { getExamplesFor } from '@atlaskit/build-utils/getExamples';
import ReactDOMServer from 'react-dom/server';

test('Progress tracker server side rendering', async done => {
  // $FlowFixMe
  const examples = await getExamplesFor('progress-tracker');
  for (const example of examples) {
    if (!example.filePath.includes('custom')) {
      /* custom example contains import on react-router-dom */
      // $StringLitteral
      const Example = await require(example.filePath).default; // eslint-disable-line import/no-dynamic-require
      expect(() =>
        ReactDOMServer.renderToString(<Example />),
      ).not.toThrowError();
    }
  }
  done();
});
