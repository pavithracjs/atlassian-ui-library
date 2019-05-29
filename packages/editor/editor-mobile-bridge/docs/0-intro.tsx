import * as React from 'react';
import { md, Example, code } from '@atlaskit/docs';
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
This component is an integration layer between @atlaskit/editor-core and native iOS and Android editors.

  ## Usage

  Use the component in your React app as follows:
  
  ${code`import { MobileEditor } from '@atlaskit/editor-mobile-bridge';`}

  ${(
    <Example
      packageName="@atlaskit/editor-mobile-bridge"
      Component={require('../examples/0-status').default}
      title="Basic"
      source={require('!!raw-loader!../examples/0-status')}
    />
  )}
`;
