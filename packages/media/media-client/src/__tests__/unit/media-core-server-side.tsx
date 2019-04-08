/**
 * @jest-environment node
 */
import * as React from 'react';
import { Component } from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { MediaClient } from '../../client';

class Example extends Component {
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

test('media-core context server side rendering', () => {
  expect(() => ReactDOMServer.renderToString(<Example />)).not.toThrowError();
});
