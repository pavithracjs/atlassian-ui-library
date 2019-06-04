/**
 * @jest-environment node
 */
// @flow

import React from 'react';
import { getExamplesFor } from '@atlaskit/build-utils/getExamples';
import ReactDOMServer from 'react-dom/server';

test('Dropdown menu server side rendering', async done => {
  (await getExamplesFor('dropdown-menu')).forEach(
    async (examples: { filePath: string }) => {
      // $StringLitteral
      const Example = await require(examples.filePath).default; // eslint-disable-line import/no-dynamic-require
      expect(() =>
        ReactDOMServer.renderToString(<Example />),
      ).not.toThrowError();
    },
  );
  done();
});
