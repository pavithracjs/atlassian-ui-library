import * as React from 'react';
import { Component } from 'react';
import * as ReactDOMServer from 'react-dom/server';
import { ContextFactory } from '../../';

class Example extends Component {
  constructor(props: any) {
    super(props);
    const context = ContextFactory.create({
      authProvider: () =>
        Promise.resolve({
          clientId: '',
          token: '',
          baseUrl: '',
        }),
    });

    context.file.getFileState('1');
  }

  render() {
    return <div />;
  }
}
// https://product-fabric.atlassian.net/browse/BUILDTOOLS-282: SSR tests are still timing out in Landkid.
test.skip('media-core context server side rendering', async () => {
  expect(() => ReactDOMServer.renderToString(<Example />)).not.toThrowError();
});
