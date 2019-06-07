/**
 * @jest-environment node
 */
import React from 'react';
import { getExamplesFor } from '@atlaskit/build-utils/getExamples';
import ReactDOMServer from 'react-dom/server';

test.skip('Icon server side rendering', async done => {
  const examples = await getExamplesFor('icon');
  for (const example of examples) {
    const Example = await require(example.filePath).default;
    expect(() => ReactDOMServer.renderToString(<Example />)).not.toThrowError();
  }
  done();
});
