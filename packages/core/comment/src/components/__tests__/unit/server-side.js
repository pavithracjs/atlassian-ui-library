/**
 * @jest-environment node
 */
// @flow
import React from 'react';
import { getExamplesFor } from '@atlaskit/build-utils/getExamples';
import ReactDOMServer from 'react-dom/server';

test('Comment server side rendering', async done => {
  // $FlowFixMe
  const examples = await getExamplesFor('comment');
  for (const example of examples) {
    // Editor example is not SSR, it is on their roadmap. At the moment, there is no need to block comment component.
    if (!example.filePath.includes('editor')) {
      // $StringLitteral
      const Example = await require(example.filePath).default; // eslint-disable-line import/no-dynamic-require
      expect(() =>
        ReactDOMServer.renderToString(<Example />),
      ).not.toThrowError();
    }
  }
  done();
});
