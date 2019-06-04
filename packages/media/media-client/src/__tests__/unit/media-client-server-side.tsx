/**
 * @jest-environment node
 */
import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { getExamplesFor } from '@atlaskit/build-utils/getExamples';
import { MediaClient } from '../..';

class Example extends React.Component {
  constructor(props: any) {
    super(props);
    const mediaClient = new MediaClient({
      authProvider: () =>
        Promise.resolve({
          clientId: '',
          token: '',
          baseUrl: '',
        }),
    });

    mediaClient.file.getFileState('1');
  }

  render() {
    return <div />;
  }
}

test('media-client server side rendering of project examples', async () => {
  (await getExamplesFor('media-client')).forEach(
    async (examples: { filePath: string }) => {
      const Example = await require(examples.filePath).default;

      expect(() =>
        ReactDOMServer.renderToString(<Example />),
      ).not.toThrowError();
    },
  );
});

test('media-client server side rendering of simple component', () => {
  expect(() => ReactDOMServer.renderToString(<Example />)).not.toThrowError();
});
