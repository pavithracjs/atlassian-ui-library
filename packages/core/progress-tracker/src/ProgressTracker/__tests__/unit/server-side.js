/**
 * @jest-environment node
 */
// @flow
import React from 'react';
import { getExamplesFor } from '@atlaskit/build-utils/getExamples';
import ReactDOMServer from 'react-dom/server';

test('Progress tracker server side rendering', async done => {
  // $FlowFixMe
  (await getExamplesFor('progress-tracker')).forEach(
    async (examples: { filePath: string }) => {
      if (!examples.filePath.includes('custom')) {
        /* custom example contains import on react-router-dom */
        // $StringLitteral
        const Example = await require(examples.filePath).default; // eslint-disable-line import/no-dynamic-require
        expect(() =>
          ReactDOMServer.renderToString(<Example />),
        ).not.toThrowError();
      }
    },
  );
  done();
});
