import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { getExamplesFor } from '@atlaskit/build-utils/getExamples';
import waitForExpect from 'wait-for-expect';

test('media-viewer server side rendering', async () => {
  const examples = await getExamplesFor('media-viewer');
  for (const example of examples) {
    waitForExpect(async () => {
      const Example = await require(example.filePath).default;
      expect(() =>
        ReactDOMServer.renderToString(<Example />),
      ).not.toThrowError();
    });
  }
});
