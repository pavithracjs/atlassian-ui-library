// @flow
import React from 'react';
import { getExamplesFor } from '@atlaskit/build-utils/getExamples';
import ReactDOMServer from 'react-dom/server';
import Avatar from '../../../index';

test.skip('Avatar server side rendering', async done => {
  // $FlowFixMe
  const examples = await getExamplesFor('avatar');
  for (const example of examples) {
    // $StringLitteral
    const Example = await require(example.filePath).default; // eslint-disable-line import/no-dynamic-require
    expect(() => ReactDOMServer.renderToString(<Example />)).not.toThrowError();
  }
  done();
});

// Test the SSR render inserts the actual image src in to the generated markup
// to allow the images to load immediately when the DOM is parsed, before hydration occurs.
test.skip('should directly render the image src for SSR', () => {
  const actualMarkup = ReactDOMServer.renderToString(
    <Avatar src="my/uniquely/me/avatar" />,
  );

  expect(actualMarkup).toContain('my/uniquely/me/avatar');
});
