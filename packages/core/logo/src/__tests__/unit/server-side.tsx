import React from 'react';
import { getExamplesFor } from '@atlaskit/build-utils/getExamples';
import ReactDOMServer from 'react-dom/server';

test('Logo server side rendering', async done => {
  const examples = await getExamplesFor('logo');
  for (const example of examples) {
    // $StringLitteral
    const Example = await require(example.filePath).default; // eslint-disable-line import/no-dynamic-require
    expect(() => ReactDOMServer.renderToString(<Example />)).not.toThrowError();
  }
  done();
});
