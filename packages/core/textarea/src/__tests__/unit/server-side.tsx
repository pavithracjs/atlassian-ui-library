/**
 * @jest-environment node
 */
import * as React from 'react';
import { getExamplesFor } from '@atlaskit/build-utils/getExamples';
import * as ReactDOMServer from 'react-dom/server';

test('TextArea server side rendering', async done => {
  const examples = await getExamplesFor('textarea');
  for (const example of examples) {
    const Example = await require(example.filePath).default;
    expect(() => ReactDOMServer.renderToString(<Example />)).not.toThrowError();
  }
  done();
});
