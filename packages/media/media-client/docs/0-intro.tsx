import * as React from 'react';
import { md, code, Example } from '@atlaskit/docs';
import SectionMessage from '@atlaskit/section-message';

export default md`
${(
  <SectionMessage appearance="warning">
    <p>
      <strong>
        Note: This component is designed for internal Atlassian development.
      </strong>
    </p>
    <p>
      External contributors will be able to use this component but will not be
      able to submit issues.
    </p>
  </SectionMessage>
)}
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
