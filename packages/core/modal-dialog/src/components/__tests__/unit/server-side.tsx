/**
 * @jest-environment node
 */
import React from 'react';
import { getExamplesFor } from '@atlaskit/build-utils/getExamples';
import ReactDOMServer from 'react-dom/server';
import Modal from '../../..';

test('Modal dialog server side rendering', async done => {
  (await getExamplesFor('modal-dialog')).forEach(
    async (examples: { filePath: string }) => {
      const Example = await require(examples.filePath).default; // eslint-disable-line import/no-dynamic-require
      expect(() =>
        ReactDOMServer.renderToString(<Example />),
      ).not.toThrowError();
    },
  );
  done();
});

test('Modal dialog should render content in ssr', () => {
  expect(() =>
    ReactDOMServer.renderToString(
      <Modal
        heading="Look at this"
        actions={[{ text: 'Close', onClick: () => {} }]}
      >
        <div>Model Content</div>
      </Modal>,
    ),
  ).not.toThrowError();
});
