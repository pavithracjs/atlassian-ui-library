import * as React from 'react';
import { md, code, Example } from '@atlaskit/docs';

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
  This package is the Media Store API Web Client Library.

  ## Usage

  ${code`import { MediaImage } from '@atlaskit/media-image';

  `}

  ${(
    <Example
      Component={require('../examples/0-media-store').default}
      title="Media Store"
      source={require('!!raw-loader!../examples/0-media-store')}
    />
  )}
`;
