import * as React from 'react';
import { getExamplesFor } from '@atlaskit/build-utils/getExamples';
import * as ReactDOMServer from 'react-dom/server';
import waitForExpect from 'wait-for-expect';

test.skip('Banner server side rendering', async () => {
  const examples = await getExamplesFor('banner');
  for (const example of examples) {
    const Example = await require(example.filePath).default; // eslint-disable-line import/no-dynamic-require
    waitForExpect(() => {
      expect(() =>
        ReactDOMServer.renderToString(<Example />),
      ).not.toThrowError();
    });
  }
});
