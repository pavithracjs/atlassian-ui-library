// @flow
import React from 'react';
import { getExamplesFor } from '@atlaskit/build-utils/getExamples';
import ReactDOMServer from 'react-dom/server';

test('Navigation server side rendering', async done => {
  // $FlowFixMe
  const examples = await getExamplesFor('navigation');
  for (const example of examples) {
    if (!example.filePath.includes('react-router')) {
      /* react router example contains import on react-router-dom */
      // $StringLitteral
      const Example = await require(example.filePath).default; // eslint-disable-line import/no-dynamic-require
      expect(() =>
        ReactDOMServer.renderToString(<Example />),
      ).not.toThrowError();
    }
  }
  done();
});
