import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { getExamplesFor } from '@atlaskit/build-utils/getExamples';
import waitForExpect from 'wait-for-expect';

beforeAll(() => {
  jest.setTimeout(20000);
});
// https://product-fabric.atlassian.net/browse/BUILDTOOLS-282: SSR tests are still timing out in Landkid.
test.skip('media-viewer server side rendering', async () => {
  const examples = await getExamplesFor('media-viewer');
  for (const example of examples) {
    const Example = await require(example.filePath).default;
    await waitForExpect(() => {
      expect(() =>
        ReactDOMServer.renderToString(<Example />),
      ).not.toThrowError();
    });
  }
});
