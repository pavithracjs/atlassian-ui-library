/**
 * @jest-environment node
 */
import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { getExamplesFor } from '@atlaskit/build-utils/getExamples';

test('Blanket server side rendering', async done => {
  (await getExamplesFor('blanket')).forEach((examples: any) => {
    const Example = require(examples.filePath).default;
    expect(async () =>
      ReactDOMServer.renderToString(<Example />),
    ).not.toThrowError();
  });
  done();
});
