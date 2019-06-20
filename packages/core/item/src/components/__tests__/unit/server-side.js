// @flow
import React from 'react';
import { getExamplesFor } from '@atlaskit/build-utils/getExamples';
import ReactDOMServer from 'react-dom/server';
// eslint-disable-next-line import/no-extraneous-dependencies
import waitForExpect from 'wait-for-expect';

test('Item server side rendering', async () => {
  // $FlowFixMe
  const examples = await getExamplesFor('item');
  for (const example of examples) {
    if (!example.filePath.includes('item-story')) {
      /* item story example contains import on react-router-dom */
      // $StringLitteral
      const Example = await require(example.filePath).default; // eslint-disable-line import/no-dynamic-require
      waitForExpect(() => {
        expect(() =>
          ReactDOMServer.renderToString(<Example />),
        ).not.toThrowError();
      });
    }
  }
});
