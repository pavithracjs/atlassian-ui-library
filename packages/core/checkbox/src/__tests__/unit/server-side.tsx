/**
 * @jest-environment node
 */
import * as React from 'react';
import { getExamplesFor } from '@atlaskit/build-utils/getExamples';
import * as ReactDOMServer from 'react-dom/server';

test('Checkbox server side rendering', async () => {
  (await getExamplesFor('checkbox')).forEach(examples => {
    const Example = require(examples.filePath).default; // tslint:disable-line:import/no-dynamic-require
    expect(() => ReactDOMServer.renderToString(<Example />)).not.toThrowError();
  });
});
