// @flow
import React from 'react';
import getExamplesFor from '@atlaskit/build-utils/getExamples';
import ReactDOMServer from 'react-dom/server';

test('Field text server side rendering', async done => {
  // $FlowFixMe
  const examples = await getExamplesFor('field-text');
  for (const example of examples) {
    // $StringLitteral
    const Example = await require(example.filePath).default; // eslint-disable-line import/no-dynamic-require
    expect(() => ReactDOMServer.renderToString(<Example />)).not.toThrowError();
  }
  done();
});
