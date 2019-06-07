/**
 * @jest-environment node
 */
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { getExamplesFor } from '@atlaskit/build-utils/getExamples';

test('Droplist server side rendering', async done => {
  (await getExamplesFor('Droplist')).forEach(
    async (examples: { filePath: string }) => {
      const Example = await require(examples.filePath).default;
      expect(() =>
        ReactDOMServer.renderToString(<Example />),
      ).not.toThrowError();
    },
  );
  done();
});
