import React from 'react';
import { getExamplesFor } from '@atlaskit/build-utils/getExamples';
import * as ReactDOMServer from 'react-dom/server';
import WidthDetector from '../..';

test.skip('Width detector server side rendering', async done => {
  const examples = await getExamplesFor('width-detector');
  for (const example of examples) {
    const Example = await require(example.filePath).default; // eslint-disable-line import/no-dynamic-require
    expect(() => ReactDOMServer.renderToString(<Example />)).not.toThrowError();
  }
  done();
});

test.skip('Width detector should render children immediately for SSR', async () => {
  const markup = <div id="foo123">Foo</div>;
  const markupString = ReactDOMServer.renderToStaticMarkup(markup);
  const html = ReactDOMServer.renderToString(
    <WidthDetector>{width => markup}</WidthDetector>,
  );
  expect(html).toContain(markupString);
});
