/**
 * @jest-environment node
 */
import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { getExamplesFor } from '@atlaskit/build-utils/getExamples';

test('Button server side rendering', async done => {
  (await getExamplesFor('button')).forEach((examples: any) => {
    const Example = require(examples.filePath).default;
    expect(() => ReactDOMServer.renderToString(<Example />)).not.toThrowError();
  });
  done();
});
