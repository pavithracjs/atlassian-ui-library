/**
 * @jest-environment node
 */
// @flow
import React from 'react';
import { getExamplesFor } from '@atlaskit/build-utils/getExamples';
import ReactDOMServer from 'react-dom/server';
import Avatar from '../../../index';

test('Avatar server side rendering', async done => {
  (await getExamplesFor('avatar')).forEach(examples => {
    // $StringLitteral
    const Example = require(examples.filePath).default; // eslint-disable-line import/no-dynamic-require
    expect(() => ReactDOMServer.renderToString(<Example />)).not.toThrowError();
  });
  done();
});

// Test the SSR render inserts the actual image src in to the generated markup
// to allow the images to load immediately when the DOM is parsed, before hydration occurs.
test('should directly render the image src for SSR', () => {
  const actualMarkup = ReactDOMServer.renderToString(
    <Avatar src="my/uniquely/me/avatar" />,
  );

  expect(actualMarkup).toContain('my/uniquely/me/avatar');
});
