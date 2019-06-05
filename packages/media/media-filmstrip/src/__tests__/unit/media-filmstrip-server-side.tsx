/**
 * @jest-environment node
 */
import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { getExamplesFor } from '@atlaskit/build-utils/getExamples';

test('media-filmstrip server side rendering', async done => {
  (await getExamplesFor('media-filmstrip')).forEach(
    async (examples: { filePath: string }) => {
      const Example = await require(examples.filePath).default;

      expect(() =>
        ReactDOMServer.renderToString(<Example />),
      ).not.toThrowError();
    },
  );
  done();
});
