import * as React from 'react';
import { md, code, Example, Props } from '@atlaskit/docs';
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
  \`\`\`NotificationIndicator\`\`\` is a React component that wraps an existing @atlaskit/badge component with
  additional functionalities:
  
  * Populate its own state by fetching data through the provided notification-log-client.
  * Sets up automatic refresh when \`\`\`refreshRate\`\`\` is specified.
  * Disables automatic refresh when tab is inactive, unless forced.

  ## Usage

  ${code`import { NotificationIndicator } from '@atlaskit/notification-indicator';`}

  ${(
    <Example
      Component={require('../examples/00-basic').default}
      title="Basic"
      source={require('!!raw-loader!../examples/00-basic')}
    />
  )}

  ${(
    <Props
      heading="Props"
      props={require('!!extract-react-types-loader!../src/NotificationIndicator')}
    />
  )}
`;
