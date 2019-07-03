import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { getExamplesFor } from '@atlaskit/build-utils/getExamples';
import waitForExpect from 'wait-for-expect';

test.skip('media-viewer server side rendering', async () => {
  const examples = await getExamplesFor('media-viewer');
  for (const example of examples) {
    await waitForExpect(async () => {
      const Example = await require(example.filePath).default;
      expect(() =>
        ReactDOMServer.renderToString(<Example />),
      ).not.toThrowError();
    });
  }
});
