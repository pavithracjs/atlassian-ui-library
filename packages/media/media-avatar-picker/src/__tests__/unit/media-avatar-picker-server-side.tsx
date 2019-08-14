import * as React from 'react';
import * as ReactDOMServer from 'react-dom/server';
import Example from '../../../examples/4-avatar-picker-with-predefined-avatar';
// https://product-fabric.atlassian.net/browse/BUILDTOOLS-282: SSR tests are still timing out in Landkid.
test.skip('media-avatar-picker server side rendering', async () => {
  expect(() => ReactDOMServer.renderToString(<Example />)).not.toThrowError();
});
