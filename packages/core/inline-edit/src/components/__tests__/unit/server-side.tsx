import * as React from 'react';
import { getExamplesFor } from '@atlaskit/build-utils/getExamples';
import * as ReactDOMServer from 'react-dom/server';
import waitForExpect from 'wait-for-expect';

beforeEach(() => {
  jest.setTimeout(10000);
});

test('Inline edit server side rendering', async () => {
  const examples = await getExamplesFor('inline-edit');
  for (const example of examples) {
    const Example = await require(example.filePath).default;
    await waitForExpect(() => {
      expect(() =>
        ReactDOMServer.renderToString(<Example />),
      ).not.toThrowError();
    });
  }
});
