// @flow
import React from 'react';
import { getExamplesFor } from '@atlaskit/build-utils/getExamples';
import ReactDOMServer from 'react-dom/server';
// eslint-disable-next-line import/no-extraneous-dependencies
import waitForExpect from 'wait-for-expect';

test('Comment server side rendering', async () => {
  // $FlowFixMe
  const examples = await getExamplesFor('comment');
  for (const example of examples) {
    // Editor example is not SSR, it is on their roadmap. At the moment, there is no need to block comment component.
    if (!example.filePath.includes('editor')) {
      // $StringLitteral
      const Example = await require(example.filePath).default; // eslint-disable-line import/no-dynamic-require
      await waitForExpect(() => {
        expect(() =>
          ReactDOMServer.renderToString(<Example />),
        ).not.toThrowError();
      });
    }
  }
});
