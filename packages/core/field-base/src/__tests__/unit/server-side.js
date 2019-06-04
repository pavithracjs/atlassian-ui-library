/**
 * @jest-environment node
 */
// @flow
import React from 'react';
import { getExamplesFor } from '@atlaskit/build-utils/getExamples';
import ReactDOMServer from 'react-dom/server';

test('Field base server side rendering', async done => {
  // $FlowFixMe
  (await getExamplesFor('field-base')).forEach(
    async (examples: { filePath: string }) => {
      // $StringLitteral
      const Example = await require(examples.filePath).default; // eslint-disable-line import/no-dynamic-require
      expect(() =>
        ReactDOMServer.renderToString(<Example />),
      ).not.toThrowError();
    },
  );
  done();
});
