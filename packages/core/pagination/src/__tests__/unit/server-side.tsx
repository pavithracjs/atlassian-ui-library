/**
 * @jest-environment node
 */
import React from 'react';
import { getExamplesFor } from '@atlaskit/build-utils/getExamples';
import ReactDOMServer from 'react-dom/server';

type Example = { filePath: string };

test('Pavigation server side rendering', async done => {
  (await getExamplesFor('pagination')).forEach((example: Example) => {
    // $StringLitteral
    if (!example.filePath.includes('react-router')) {
      /* react router example contains import on react-router-dom */
      // $StringLitteral
      const Example = await require(example.filePath).default; // eslint-disable-line import/no-dynamic-require
      expect(() =>
        ReactDOMServer.renderToString(<Example />),
      ).not.toThrowError();
    }
  });
  done();
});
