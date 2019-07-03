import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { getExamplesFor } from '@atlaskit/build-utils/getExamples';
import waitForExpect from 'wait-for-expect';

beforeAll(() => {
  jest.setTimeout(30000);
});

test('media-card server side rendering', async () => {
  const examples = await getExamplesFor('media-card');
  for (const example of examples) {
    const Example = await require(example.filePath).default;
    await waitForExpect(() => {
      expect(() =>
        ReactDOMServer.renderToString(<Example />),
      ).not.toThrowError();
    });
  }
});
