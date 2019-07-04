import React from 'react';
import { getExamplesFor } from '@atlaskit/build-utils/getExamples';
import ReactDOMServer from 'react-dom/server';
import waitForExpect from 'wait-for-expect';

beforeEach(() => {
  jest.setTimeout(10000);
});

test('Breadcrumbs server side rendering', async () => {
  const examples = await getExamplesFor('breadcrumbs');
  for (const example of examples) {
    const Example = await require(example.filePath).default; // eslint-disable-line import/no-dynamic-require
    await waitForExpect(() => {
      expect(() =>
        ReactDOMServer.renderToString(<Example />),
      ).not.toThrowError();
    });
  }
});
