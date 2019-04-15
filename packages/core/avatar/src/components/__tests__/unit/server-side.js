/**
 * @jest-environment node
 */
// @flow
import React from 'react';
import { getExamplesFor } from '@atlaskit/build-utils/getExamples';
import ReactDOMServer from 'react-dom/server';
import Avatar from '../../../index';

test('Avatar server side rendering', async () => {
  (await getExamplesFor('avatar')).forEach(examples => {
    // $StringLitteral
    const Example = require(examples.filePath).default; // eslint-disable-line import/no-dynamic-require
    expect(() => ReactDOMServer.renderToString(<Example />)).not.toThrowError();
  });
});

it('should directly render the image src for SSR', () => {
  const actualMarkup = ReactDOMServer.renderToString(
    <Avatar src="some/avatar/img" />,
  );

  expect(actualMarkup).toContain('some/avatar/img');
});
