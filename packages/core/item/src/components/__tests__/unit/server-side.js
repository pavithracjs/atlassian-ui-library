/**
 * @jest-environment node
 */
// @flow
import React from 'react';
import { getExamplesFor } from '@atlaskit/build-utils/getExamples';
import ReactDOMServer from 'react-dom/server';

test('Item server side rendering', async done => {
  // $FlowFixMe
  (await getExamplesFor('item')).forEach(
    async (examples: { filePath: string }) => {
      if (!examples.filePath.includes('item-story')) {
        /* item story example contains import on react-router-dom */
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
