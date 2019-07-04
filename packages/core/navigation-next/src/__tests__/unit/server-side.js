// @flow

import React from 'react';
import { getExamplesFor } from '@atlaskit/build-utils/getExamples';
import ReactDOMServer from 'react-dom/server';
// eslint-disable-next-line import/no-extraneous-dependencies
import waitForExpect from 'wait-for-expect';

const examplesWithDomOrBrowser = [
  '0-navigation-app',
  '12-async-load-layout-manager',
  '13-async-load-layout-manager-with-view-controller',
  '9999-views-controller-adding-routes',
  '9999-views-controller-asynchronous-views',
  '9999-views-controller-container-views',
  '9999-views-controller-reducing-views',
];
const exampleName = (file: string) =>
  file
    .split('/')
    .reverse()[0]
    .replace('.js', '');

beforeEach(() => {
  jest.setTimeout(20000);
});

test('navigation-next server side rendering', async () => {
  // $FlowFixMe
  const examples = await getExamplesFor('navigation-next');
  for (const example of examples) {
    if (!examplesWithDomOrBrowser.includes(exampleName(example.filePath))) {
      // $StringLitteral
      const Example = await require(example.filePath).default; // eslint-disable-line import/no-dynamic-require
      await waitForExpect(() => {
        expect(() =>
          ReactDOMServer.renderToString(<Example />),
        ).not.toThrowError();
      });
    }
  }
});
