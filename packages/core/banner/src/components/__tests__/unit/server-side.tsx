/**
 * @jest-environment node
 */
import * as React from 'react';
import { getExamplesFor } from '@atlaskit/build-utils/getExamples';
import * as ReactDOMServer from 'react-dom/server';

test('Banner server side rendering', async () => {
  (await getExamplesFor('banner')).forEach((examples: any) => {
    const Example = require(examples.filePath).default; // tslint:disable-line:import/no-dynamic-require
    expect(() => ReactDOMServer.renderToString(<Example />)).not.toThrowError();
  });
});
