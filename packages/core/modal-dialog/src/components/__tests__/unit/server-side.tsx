import React from 'react';
import { getExamplesFor } from '@atlaskit/build-utils/getExamples';
import ReactDOMServer from 'react-dom/server';
import Modal from '../../..';
import waitForExpect from 'wait-for-expect';

beforeEach(() => {
  jest.setTimeout(30000);
});

test('Modal dialog server side rendering', async () => {
  const examples = await getExamplesFor('modal-dialog');
  for (const example of examples) {
    const Example = await require(example.filePath).default; // eslint-disable-line import/no-dynamic-require
    await waitForExpect(() => {
      expect(() =>
        ReactDOMServer.renderToString(<Example />),
      ).not.toThrowError();
    });
  }
});

test('Modal dialog should render content in ssr', async () => {
  await waitForExpect(() => {
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
});
