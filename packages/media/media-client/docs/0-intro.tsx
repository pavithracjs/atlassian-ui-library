import * as React from 'react';
import { md, code, Example } from '@atlaskit/docs';

export default md`
  This package is the Media Client API Web Client Library.

  ## Usage

  ${code`import { MediaClient } from '@atlaskit/media-client';
const mediaClient = new MediaClient({ authProvider });
  `}

  ${(
    <Example
      Component={require('../examples/2-upload-file').default}
      title="Media Client"
      source={require('!!raw-loader!../examples/2-upload-file')}
    />
  )}
`;
