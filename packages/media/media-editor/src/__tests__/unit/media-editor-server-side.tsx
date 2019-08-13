import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { getExamplesFor } from '@atlaskit/build-utils/getExamples';

beforeAll(() => {
  jest.setTimeout(10000);
});
// https://product-fabric.atlassian.net/browse/BUILDTOOLS-282: SSR tests are still timing out in Landkid.
test.skip('media-editor server side rendering', async done => {
  const examples = await getExamplesFor('media-editor');
  for (const example of examples) {
    const Example = await require(example.filePath).default;

    expect(() => ReactDOMServer.renderToString(<Example />)).not.toThrowError();
  }
  done();
});
