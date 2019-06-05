/**
 * @jest-environment node
 */
// @flow
import React from 'react';
import { getExamplesFor } from '@atlaskit/build-utils/getExamples';
import ReactDOMServer from 'react-dom/server';
import SizeDetector from '../..';

test('SizeDetector server side rendering', async done => {
  // $FlowFixMe
  (await getExamplesFor('size-detector')).forEach(
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

it('SizeDetector should render children immediately for SSR', async () => {
  const markup = <div id="foo123">Foo</div>;
  const markupString = ReactDOMServer.renderToStaticMarkup(markup);
  const html = ReactDOMServer.renderToString(
    <SizeDetector>{() => markup}</SizeDetector>,
  );
  expect(html).toContain(markupString);
});
