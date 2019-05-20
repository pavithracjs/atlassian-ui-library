/**
 * @jest-environment node
 */
import React from 'react';
import { getExamplesFor } from '@atlaskit/build-utils/getExamples';
import ReactDOMServer from 'react-dom/server';

test('Checkbox server side rendering', async () => {
  (await getExamplesFor('checkbox')).forEach((examples: any) => {
    const Example = require(examples.filePath).default; // tslint:disable-line:import/no-dynamic-require
    expect(() => ReactDOMServer.renderToString(<Example />)).not.toThrowError();
  });
});
