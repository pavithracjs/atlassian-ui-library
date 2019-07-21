import React from 'react';
import ReactDOMServer from 'react-dom/server';

import { getExamplesFor } from '@atlaskit/build-utils/getExamples';

test.skip('Popper server side rendering', async done => {
  const examples = await getExamplesFor('popper');
  for (const example of examples) {
    const Example = await require(example.filePath).default; // eslint-disable-line import/no-dynamic-require
    expect(() => ReactDOMServer.renderToString(<Example />)).not.toThrowError();
  }
  done();
});
