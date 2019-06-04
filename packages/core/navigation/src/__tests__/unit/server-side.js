/**
 * @jest-environment node
 */
// @flow
import React from 'react';
import { getExamplesFor } from '@atlaskit/build-utils/getExamples';
import ReactDOMServer from 'react-dom/server';

test('Navigation server side rendering', async done => {
  (await getExamplesFor('navigation')).forEach(
    async (examples: { filePath: string }) => {
      if (!examples.filePath.includes('react-router')) {
        /* react router example contains import on react-router-dom */
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
