import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { getExamplesFor } from '@atlaskit/build-utils/getExamples';
import waitForExpect from 'wait-for-expect';

test.skip('media-card server side rendering', async done => {
  const examples = await getExamplesFor('media-card');
  for (const example of examples) {
    const Example = await require(example.filePath).default;
    waitForExpect(() => {
      expect(() =>
        ReactDOMServer.renderToString(<Example />),
      ).not.toThrowError();
    });
  }
});
